import {moveData} from './moves.js';

export var pokemonFilters = 
{
    "Resists" : {filter:resists, params:"type"},
    "Immune To": {filter:immuneTo, params:"type"},
    "Weak To" : {filter:weakTo, params:"type"},
    "Is Not Weak To" : {filter:isNotWeakTo, params:"type"},
    "Has Damaging Move" : {filter:hasDamagingMove, params:"type"},
    "Has Type" : {filter:hasType, params:"type"},
    "In Game": {filter:presentInGame, params:"game"},
};

function presentInGame(data,filterParams)
{
    var games = data["Games"].split(",");
    for(var game of games)
    {
        if(game == filterParams.game)
        {
            return true;
        }
    }
    return false;
}

function resists(data, filterParams)
{     
    return data["Half Damage From"].includes(filterParams.type) || 
           data["No Damage From"].includes(filterParams.type);
}

function immuneTo(data, filterParams)
{ 
    return data["No Damage From"].includes(filterParams.type);
}

function hasType(data, filterParams)
{ 
    return data["Types"].includes(filterParams.type);
}

function weakTo(data, filterParams)
{ 
    return data["Double Damage From"].includes(filterParams.type);
}

function isNotWeakTo(data, filterParams)
{ 
    return !data["Double Damage From"].includes(filterParams.type);
}

function hasDamagingMove(data, filterParams)
{ 
    var moves = data["Moves"].split(",");
    for(var move of moves)
    {
        if(!moveData[move])
        {
            continue;
        }
        if(moveData[move].Type == filterParams.type)
        {
            if(moveData[move].Power != null && moveData[move].Power > 0)
            {
                return true;
            }
        }
    }
    return false;
}