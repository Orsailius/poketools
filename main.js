import {pokemonTypes} from './code/types.js';
import {pokemonGames} from './code/games.js';
import {pokemonFilters} from './code/filters.js';
import useMoveData from './code/moves.js';
import usePokemonData from './code/pokemon.js';
import { createFusionData } from './code/pokemon.js';


window.onload = (event) =>
{
    //createFilter();
    window.switchToPokedex();
};

function buildTypeOptions()
{
    var options = "";
    pokemonTypes.forEach(function(type)
    {
        options += `<option value="` + type.name +`">` + type.name + `</option>`;       
    });
    return options;
}

function buildGameOptions()
{
    var options = "";
    pokemonGames.forEach(function(gameName)
    {
        options += `<option value="` + gameName +`">` + gameName + `</option>`;       
    });
    return options;
}

Tabulator.extendModule("format", "formatters", 
{
    pokemonTypes:function(cell, formatterParams)
    {
        var types = cell.getValue().split(",");
        var s = "<div>";
        types.forEach(function (t)
        {
            s += "<a class='pokemon-type pokemon-type-" + t.toLowerCase() + "'>" + t + "</a>";
        });
        return s + "</div>"
    },
    pokemonTypesArray:function(cell, formatterParams)
    {
        var types = cell.getValue();
        var s = "<div class='type-grid'>";
        types.forEach(function (t)
        {
            s += "<a class='pokemon-type pokemon-type-" + t.toLowerCase() + "'>" + t + "</a>";
        });
        return s + "</div>"
    },
});

//table.setFilter(customFilter, {height:3});

function createStatColumnHeader(title, field)
{
    return {
        title: title, 
        field: field, 
        formatter:"progress", 
        formatterParams:
        {
            min:0,
            max:255,
            color:["red", "orange", "orange", 
                   "yellow", "#A0E515", "#A0E515", 
                   "#A0E515", "#A0E515", "#A0E515", 
                   "blue", "blue", "blue"],
            legend:true
        }};
}

var focusedPokemon;
var team = new Object();
var loadedTeam =  localStorage.getItem("team");
if(loadedTeam != null)
{
    team = JSON.parse(loadedTeam);
}

console.debug(team);

function saveTeam()
{
    localStorage.setItem("team", JSON.stringify(team));
}

function createTeamTypeTable()
{
    window.teamTypeTable = new Tabulator("#team-type-table", {
        height:805, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
        layout:"fitColumns", //fit columns to width of table (optional)
         columns:[ //Define Table Columns
            {title:"Metric", field:"Metric", width:150, frozen:true},
            {title:"Red Flag", field:"RedFlag",formatter:"pokemonTypesArray"},
            {title:"Warning", field:"Warning",formatter:"pokemonTypesArray"},
            {title:"Ok", field:"Ok",formatter:"pokemonTypesArray"},
            {title:"Good", field:"Good",formatter:"pokemonTypesArray"},
            {title:"Great", field:"Great",formatter:"pokemonTypesArray"},
         ]
    });
    window.teamTypeTable.on("tableBuilt", function()
    {
        refreshTeamAnalytics();
    });
}

function refreshTeamAnalytics()
{
    window.teamTypeTable.setData(createTeamAnalytics())
    .then(function()
    {
       // console.debug("Successfully Set Team Data");
        //alert("Success!");
    })
    .catch(function(error)
    {
        console.debug("error setting team data");
        console.debug(error);
    });
}

function getTypeFromName(name)
{
    return pokemonTypes.find(x=>x.name == name);
}

function groupResists(resist, resistCount, type)
{
    if(resistCount > 3)
    {
        resist.RedFlag.push(type.name);
    }  
    else if(resistCount > 2)
    {
        resist.Warning.push(type.name);
    }  
    else if(resistCount > 1)
    {
        resist.Ok.push(type.name);
    }  
    else if(resistCount > 0)
    {
        resist.Good.push(type.name);
    }  
    else
    {
        resist.Great.push(type.name);
    }
}

function groupWeakness(weakTo, weakCount, type)
{
    if(weakCount > 3)
    {
        weakTo.RedFlag.push(type.name);
    }  
    else if(weakCount > 2)
    {
        weakTo.Warning.push(type.name);
    }  
    else if(weakCount > 1)
    {
        weakTo.Ok.push(type.name);
    }  
    else if(weakCount > 0)
    {
        weakTo.Good.push(type.name);
    }  
    else
    {
        weakTo.Great.push(type.name);
    }
}

function groupSuperEffective(superEffective, superCount, type)
{
    if(superCount > 3)
    {
        superEffective.Great.push(type.name);
    }  
    else if(superCount > 2)
    {
        superEffective.Good.push(type.name);
    }  
    else if(superCount > 1)
    {
        superEffective.Ok.push(type.name);
    }  
    else if(superCount > 0)
    {
        superEffective.Warning.push(type.name);
    }  
    else
    {
        superEffective.RedFlag.push(type.name);
    }
}

function createAnalyicsObject(metric)
{
   var object = 
    {
        Metric: metric,
        RedFlag:[],
        Warning:[],
        Ok:[],
        Good:[],
        Great:[],
    };
    return object;
}

function isWeakTo()
{
    
}

function createTeamAnalytics()
{  
    var resist = createAnalyicsObject("Take Half From");
    var weakTo = createAnalyicsObject("Take Double From");     
    var superEffective = createAnalyicsObject("Can Hit Super");

    pokemonTypes.forEach(type=>
    {    
        var resistCount = 0;
        var weakCount = 0;
        var hitSuper = 0;
        Object.values(team).forEach(p=>
        {        
            var myTypes = p.Types.split(",");       
            if(myTypes.length == 1)
            {
                if(type.resists.includes(myTypes[0]) || 
                type.immuneTo.includes(myTypes[0]))
                {
                    resistCount++;
                }
                if(getTypeFromName(myTypes[0]).weakTo.includes(type.name))
                {
                    weakCount++;
                }
            }
            else
            {
                if((type.resists.includes(myTypes[0]) || 
                type.immuneTo.includes(myTypes[0])) && 
                !type.weakTo.includes(myTypes[1]))
                {
                    resistCount++;
                }
                else if((type.resists.includes(myTypes[1]) || 
                type.immuneTo.includes(myTypes[1])) && 
                !type.weakTo.includes(myTypes[0]))
                {
                    resistCount++;
                }
                if(getTypeFromName(myTypes[0]).weakTo.includes(type.name))
                {
                    var type2 = getTypeFromName(myTypes[1]);
                    if(!type2.resists.includes(type.name) && !type.immuneTo.includes(type.name))
                    {
                        weakCount++;
                    }
                }
                else if(getTypeFromName(myTypes[1]).weakTo.includes(type.name))
                {
                    var type2 = getTypeFromName(myTypes[0]);
                    if(!type2.resists.includes(type.name) && !type.immuneTo.includes(type.name))
                    {
                        weakCount++;
                    }
                }
            }
            if(p.Move1 != "None" && hitSuperEffective(p.Move1, type))
            {
                hitSuper++;
            }
            if(p.Move2 != "None" && hitSuperEffective(p.Move2, type))
            {
                hitSuper++;
            }
            if(p.Move3 != "None" && hitSuperEffective(p.Move3, type))
            {
                hitSuper++;
            }
            if(p.Move4 != "None" && hitSuperEffective(p.Move4, type))
            {
                hitSuper++;
            }
        });
        groupResists(resist, resistCount, type);
        groupWeakness(weakTo, weakCount, type);
        groupSuperEffective(superEffective, hitSuper, type);
    });
    var arr = new Array();
    arr.push(resist);
    arr.push(weakTo);
    arr.push(superEffective);
    return arr;
}

function hitSuperEffective(move, type)
{
    if(move.Power == null || move.Power == 0)
    {
        return false;
    }
    if(type.weakTo.includes(move.Type))
    {
        return true;
    }
    return false;
}

function moveChoiceFormatter(cell, formatterParams, onRendered)
{
    if(cell.getValue() == "None")
    {
        return '<button> Find a Move </button>';
    }
    else
    {
        var move = cell.getValue();                    
        var s = "<a class='pokemon-type pokemon-type-for-move pokemon-type-" + move.Type.toLowerCase() + "'>" + move.Name + "</a>";
        return s;
    }
}

function moveClick(e,cell)
{
    showMoveSelector(cell.getData(), cell.getColumn().getField());
}

function teamFocusClick(e,cell)
{
    focusOnPokemon(cell.getData());
}

function createTeamTable()
{
    window.teamTable = new Tabulator("#team-table", {
        height:305, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
        layout:"fitColumns", //fit columns to width of table (optional)
        index:"Name",
        columns:[ //Define Table Columns
            {title:"Name", field:"Name", width:150, frozen:true, cellClick: teamFocusClick},
            {title:"Types", field:"Types", formatter:"pokemonTypes"},
            {title:"Move 1", field:"Move1", formatter: moveChoiceFormatter, cellClick: moveClick},
            {title:"Move 2", field:"Move2", formatter: moveChoiceFormatter, cellClick: moveClick},
            {title:"Move 3", field:"Move3", formatter: moveChoiceFormatter, cellClick: moveClick},
            {title:"Move 4", field:"Move4", formatter: moveChoiceFormatter, cellClick: moveClick},
            {title:"Attacker Type", field:"Attacker Type", mutator:function(value, data)
            {
                const attack = parseInt(data.Attack);
                const spAttack = parseInt(data["Special Attack"]);
                if(attack - spAttack > 25)
                {
                    return "Physical";
                }
                if(spAttack - attack > 25)
                {
                    return "Special";
                }
                return "Mixed";
            }},         
         ]
    });
    //
    window.teamTable.on("tableBuilt", function()
    {
        refreshTeamTable();
    });
}

function refreshTeamTable()
{
    if(window.teamTable == null)
    {
        return;
    }
    console.debug(team);
    window.teamTable.setData(Object.values(team))
    .then(function()
    {
       // console.debug("Successfully Set Team Data");
        //alert("Success!");
    })
    .catch(function(error)
    {
        console.debug("error setting team data");
        console.debug(error);
    });
}

window.switchToTeam = function switchToTeam()
{
    if(document.getElementById("team").childElementCount == 0)
    {
        document.getElementById("team").innerHTML = `<div id="team-table"></div><div id="team-type-table"></div>`;
        createTeamTable();    
        createTeamTypeTable();
    }
    else
    {
        refreshTeamTable();
        refreshTeamAnalytics();
    }
    document.getElementById("team").style.display = "block";
    document.getElementById("pokedex").style.display = "none";
}

window.switchToPokedex = function switchToPokedex()
{
    if(document.getElementById("pokedex").childElementCount == 0)
    {
        document.getElementById("pokedex").innerHTML = 
        `<div id="filters" class="table-controls">
        <div>
        <button id="createFilterButton" >Add a Filter</button>
        <label id="pokemonFound" style="display:inline-block"> Found Pokemon</label>
        </div>
        </div>
        <div id="example-table"></div>`;
        document.getElementById("createFilterButton").addEventListener("click", (ev) => createFilter());
        createPokedex();    
    }
    document.getElementById("pokedex").style.display = "block";        
    document.getElementById("team").style.display = "none";
}


/*window.switchToFusionSearch = function switchToFusionSearch()
{
    if(document.getElementById("fusionSearch").childElementCount == 0)
    {
        document.getElementById("fusionSearch").innerHTML = 
        `<div id="filters" class="table-controls">
            <div>
                <button id="createFilterButton" >Add a Filter</button>
                <label id="pokemonFound" style="display:inline-block"> Found Pokemon</label>
            </div>
        </div>
        <div id="fusion-table"></div>`;
        document.getElementById("createFilterButton").addEventListener("click", (ev) => createFilter());
        createPokedex();    
    }
    document.getElementById("pokedex").style.display = "block";        
    document.getElementById("team").style.display = "none";
}*/

var table;

async function createMoveTable(data, column)
{
    const moveData = await useMoveData();

    window.moveTable = new Tabulator("#move-table", {
        height:605, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
        layout:"fitColumns", //fit columns to width of table (optional)
        columns:[ //Define Table Columns
            {title:"Name", field:"Name", width:150, frozen:true},
            {title:"Type", field:"Type", formatter:"pokemonTypes"},
            {title:"Power", field:"Power"},
            {title:"Accuracy", field:"Accuracy"},
            {title:"Description", field:"Description"},
         ]
    });
    //
    window.moveTable.on("tableBuilt", async function()
    {
        var moves = data["Moves"].split(",");
        var pkmnMoves = new Array();       
        for(var move of moves)
        {
            console.log(move);
            if(!moveData[move])
            {
                continue;
            }
            pkmnMoves.push(moveData[move]);
        }
        //window.moveTable.setData(Object.values(moveData))
        window.moveTable.setData(pkmnMoves)
        .then(function()
        {
            console.debug("Successfully Set Move Data");         
             
        })
        .catch(function(error)
        {
            console.debug("error setting move data");
            console.debug(error);
        });
    });
    //
    window.moveTable.on("rowClick", function(e, row)
    { 
        var updateObject = {Name: data.Name}
        updateObject[column] = row.getData();
        window.teamTable.updateData([updateObject]); 
        window.teamTypeTable.setData(createTeamAnalytics());
        //
        saveTeam();
        //console.debug("Closing Swal");
        Swal.close();
    });
}

function showMoveSelector(data, column)
{
    Swal.fire({
        title: 'Moves for ' + data.Name,
        html: `<div id="move-table"></div>`,
        cancelButtonText: 'Cancel',
        width: "75%",
        focusConfirm: false,      
      });
    createMoveTable(data, column);
}

function addPokemonToTeam(pkmn)
{
    var teamPkmn = {...pkmn};
    teamPkmn.Move1 = teamPkmn.Move2 = teamPkmn.Move3 = teamPkmn.Move4 = "None";
    //teamPkmn.Move4 = moveData["Surf"];
    team[pkmn.Name] = teamPkmn;
    saveTeam();
}

function removePokemonFromTeam(pkmn)
{
    delete team[pkmn.Name];
    saveTeam();
}

function focusOnPokemon(data)
{
    console.debug("Firing Event for " + data.Name);
    if(team.hasOwnProperty(data.Name))
    {
        Swal.fire({
            title: data.Name,
            text: 'Remove ' + data.Name + ' to Your Team?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Kick!'
        }).then((result)=>
        {
            if(result.isConfirmed)
            {
                removePokemonFromTeam(data);
                refreshTeamTable();
                Swal.fire
                (
                    'Success',
                    data.Name + 'has been removed to your team',
                    'success'
                );
            }
        });
    }
    else
    {
        Swal.fire({
            title: data.Name,
            text: 'Add ' + data.Name + ' to Your Team?',
            html: "<button onClick=\"switchToFusion(\'" + data.Name + "\')\"> Search for Fusion </button>",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yeah!'
        }).then((result)=>
        {
            if(result.isConfirmed)
            {
                addPokemonToTeam(data);
                Swal.fire
                (
                    'Success',
                    data.Name + 'has been added to your team',
                    'success'
                );
            }
        });
    }
}

window.switchToFusion = async function(pokemonName)
{
    const pokemon = (await usePokemonData()).find(x=>x.Name == pokemonName);
    const fusions = createFusionData(pokemon, table.getData(true));
    table.setData(fusions);
    const cancelButton = document.getElementById("cancelFusion");
    cancelButton.style.display = "block";
    cancelButton.addEventListener("click", (evt)=>
    {
        refreshPokedexTableData();
        cancelButton.style.display = "none";
    });
    console.log(fusions[0]);
    Swal.clickCancel();
}

async function createPokedex()
{
    await usePokemonData();
    await useMoveData();

    table = new Tabulator("#example-table", {
        height:805, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
        layout:"fitColumns", //fit columns to width of table (optional)
        rowClick:function(e, row)
        {
            focusOnPokemon(row.getData());
        },
        columns:[ //Define Table Columns
            {title:"Name", field:"Name", width:150, frozen:true},
            {title:"Types", field:"Types", width:175, formatter:"pokemonTypes"},
            createStatColumnHeader("HP", "HP"),
            createStatColumnHeader("Attack", "Attack"),
            createStatColumnHeader("Defense", "Defense"),
            createStatColumnHeader("Special Attack", "Special Attack"),
            createStatColumnHeader("Special Defense", "Special Defense"),
            createStatColumnHeader("Speed", "Speed"),
            {title:"Base Stat Total", field: "BST", mutator:function(value, data)
            {
                return parseInt(data.HP) + 
                parseInt(data.Attack) + 
                parseInt(data.Defense) + 
                parseInt(data["Special Attack"]) + 
                parseInt(data["Special Defense"]) + 
                parseInt(data.Speed);
            }},         
        ]
    });

    table.on("tableBuilt", function()
    { 
        refreshPokedexTableData();
    });

    table.on("dataFiltered", function(filters, rows)
    {
        document.getElementById("pokemonFound").innerText = "Pokemon Found: " + rows.length;
    });

    table.on("rowClick", function(e, row)
    { 
        focusOnPokemon(row.getData());
    });
}

async function refreshPokedexTableData()
{
    const pokemon = await usePokemonData();
    table.setData(pokemon)
    .then(function()
    {
        //console.debug("Successfully Set Data");
        //alert("Success!");
    })
    .catch(function(error)
    {
        console.debug("error");
        console.debug(error);
    //alert(error);
    });
}
//create Tabulator on DOM element with id "example-table"

//createPokedex();

//trigger an alert message when the row is clicked




var filterId = 0;

function buildFilterOptions()
{
    var options = "";
    Object.keys(pokemonFilters).forEach(function(key)
    {
        options += `<option value="` + key +`">` +key + `</option>`;       
    });
    return options;
}

function updateFilter()
{
    var filterList = [];
    for(var i = 0;i < filterId;i++)
    {
        var filterFieldElement = document.getElementById("filter-field-"+i);
        if(!filterFieldElement)
        {
            continue;
        }         
        var filterParams = {};
        var filterField = filterFieldElement.value;
        var filter = pokemonFilters[filterField]; 
        if(filter.params=="type")
        {
            var filterPokemonType = document.getElementById("filter-pokemon-type-" + i).value;
            filterParams.type = filterPokemonType;
            //
            document.getElementById("filter-pokemon-game-" + i).style.display = "none";
            document.getElementById("filter-pokemon-game-label-" + i).style.display = "none";
            document.getElementById("filter-pokemon-type-" + i).style.display = "inline-block";
            document.getElementById("filter-pokemon-type-label-" + i).style.display = "inline-block";
        }
        else if(filter.params=="game")
        {
            var filterPokemonGame = document.getElementById("filter-pokemon-game-" + i).value;  
            filterParams.game = filterPokemonGame;
            document.getElementById("filter-pokemon-game-" + i).style.display = "inline-block";
            document.getElementById("filter-pokemon-game-label-" + i).style.display = "inline-block";
            document.getElementById("filter-pokemon-type-" + i).style.display = "none";
            document.getElementById("filter-pokemon-type-label-" + i).style.display = "none";
        }
        var filterFunc = filter.filter;
        filterList.push({filter:filterFunc, params:filterParams});
    }
    var compose = (data,params)=>
    {
        var ok = true;
        filterList.forEach(x=>
        {   
            ok &= x.filter(data,x.params);
        });
        return ok;
    };
    table.setFilter(compose);
}

function removeFilter(event)
{
    event.target.parentElement.remove();
    updateFilter();
}

function createFilter()
{
    var filterHTML = `
      <label>Filter</label>
      <select id="filter-field-` + filterId +`">`
      + buildFilterOptions() + `
      </select> 

      <label id=filter-pokemon-type-label-` + filterId + `>Type</label>
      <select id="filter-pokemon-type-` + filterId +`">
        ` + buildTypeOptions() +
      `</select>  

      <label id=filter-pokemon-game-label-` + filterId + `>Game</label>
      <select id="filter-pokemon-game-` + filterId +`">
        ` + buildGameOptions() +
      `</select>  
      <button id="filter-clear-` + filterId + `" onClick="window.removeFilter">Remove Filter</button>
    `;  
    var div = document.createElement("div");
    div.innerHTML = filterHTML;
    document.getElementById("filters").appendChild(div);
    document.getElementById("filter-clear-" + filterId).addEventListener("click",(evt)=>removeFilter(evt));
    document.getElementById("filter-pokemon-type-" + filterId).addEventListener("change",(evt)=>updateFilter());
    document.getElementById("filter-pokemon-game-" + filterId).addEventListener("change",(evt)=>updateFilter());
    document.getElementById("filter-field-" + filterId).addEventListener("change",(evt)=>updateFilter());
    //
    filterId++;
    //
    updateFilter();
}