import { pokemonTypes } from "./types.js";
import { presentInGame } from "./filters.js";

var pokemonData = new Array();

const usePokemonData = async function() 
{
    if(pokemonData.length != 0)
    {
        return pokemonData;
    }
    const response = await fetch('pokemon.json');
    const data = await response.json();
    pokemonData = fixDoubleDamageFrom(data);
    const response2 = await fetch('scarletVioletExp.json');
    const dataex = await response2.json();
    console.debug(dataex);
    pokemonData = pokemonData.concat(fixDoubleDamageFrom(dataex));    
    return pokemonData;
}

export const createFusionData = function(targetPokemon)
{
    var fusionData = new Array();
    for(var pokemon of pokemonData)
    {
        if(presentInGame(pokemon,{game:"Infinite Fusion"}))
        {
            console.log("Fusing " + pokemon.Name + " and " + targetPokemon.Name);
            fusionData.push(fuse(pokemon, targetPokemon));
            fusionData.push(fuse(targetPokemon, pokemon));
        }
    }
    return fusionData;
}

const fuse = function(body,head)
{
    const bodyTypeSource = body.Emits ?? body.Types;
    const headTypeSource = head.Emits ?? head.Types;
    //
    const bodyTypes = bodyTypeSource.split(",");
    const bodyType = bodyTypes.length > 1 ? bodyTypes[1] : bodyTypes[0];
    const headType =  headTypeSource.split(",")[0];
    const fusedPokemon = {
        Name: head["Name"].substring(0,head["Name"].length/2) + body["Name"].substring(body["Name"].length/2),
        Types: headType == bodyType ? headType : headType + "," + bodyType,
        Attack: Math.round(head["Attack"] / 3 + 2 * body["Attack"]/3),
        Defense:  Math.round(head["Defense"] / 3 + 2 * body["Defense"]/3),
        Speed:  Math.round(head["Speed"] / 3 + 2 * body["Speed"]/3),
        "Special Attack":  Math.round(body["Special Attack"] / 3 + 2 * head["Special Attack"]/3),
        "Special Defense":  Math.round(body["Special Defense"] / 3 + 2 * head["Special Defense"]/3),
        HP:  Math.round(body["HP"] / 3 + 2 * head["HP"]/3),
        Moves:  head["Moves"] + "," + body["Moves"],
        Games: head["Games"] + "," + body["Games"] + ",Infinite Fusion"
    }
    console.log("Made Fusion " +fusedPokemon.Name);
    fuseTypes(fusedPokemon);
    return fusedPokemon;
}

const fuseTypes = function(fusedPokemon)
{

}

export default usePokemonData;

function fixDoubleDamageFrom(data)
{
    data.forEach(e => 
    {
        e["Double Damage From"] = "";
        pokemonTypes.forEach(type=>
        {
            var myTypes = e.Types.split(",");
            var multiple = 1;
            myTypes.forEach(mt=>
            {
                var typeObject = pokemonTypes.find(x=>x.name == mt);
                if(typeObject == undefined)
                {
                    console.log("No Type Found:" + mt)
                    return;
                }
                if(typeObject.weakTo.includes(type.name))
                {
                    multiple *= 2;
                }
                if(typeObject.resists.includes(type.name))
                {
                    multiple *= 0.5;
                }
                if(typeObject.immuneTo.includes(type.name))
                {
                    multiple *= 0;
                }
            });
            if(multiple > 1)
            {
                e["Double Damage From"] += "," + type.name;
            }
        });
    });
    return data;
}