import {pokemonTypes} from './code/types.js';


window.onload = (event) =>
{
    //createFilter();
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

function createTeamAnalytics()
{  
    var resist = 
    {
        Metric: "Take Half From",
        RedFlag:[],
        Warning:[],
        Ok:[],
        Good:[],
        Great:[],
    };
    var weakTo = 
    {
        Metric: "Take Double From",
        RedFlag:[],
        Warning:[],
        Ok:[],
        Good:[],
        Great:[],
    };
    var superEffective = 
    {
        Metric: "Can Hit Super",
        RedFlag:[],
        Warning:[],
        Ok:[],
        Good:[],
        Great:[],
    };
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

function createTeamTable()
{
    window.teamTable = new Tabulator("#team-table", {
        height:305, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
        layout:"fitColumns", //fit columns to width of table (optional)
        index:"Name",
        columns:[ //Define Table Columns
            {title:"Name", field:"Name", width:150, frozen:true},
            {title:"Types", field:"Types", formatter:"pokemonTypes"},
            {title:"Move 1", field:"Move1", formatter: moveChoiceFormatter, cellClick: moveClick},
            {title:"Move 2", field:"Move2", formatter: moveChoiceFormatter, cellClick: moveClick},
            {title:"Move 3", field:"Move3", formatter: moveChoiceFormatter, cellClick: moveClick},
            {title:"Move 4", field:"Move4", formatter: moveChoiceFormatter, cellClick: moveClick},
         ]
    });
    //
    window.teamTable.on("tableBuilt", function()
    {
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
    });
}


window.switchToTeam = function switchToTeam()
{
    document.getElementById("pageBody").innerHTML = `<div id="team-table"></div><div id="team-type-table"></div>`;
    createTeamTable();    
    createTeamTypeTable();
}

window.switchToPokedex = function switchToPokedex()
{
    document.getElementById("pageBody").innerHTML = 
    `<div id="filters" class="table-controls">
    <div>
      <button onclick="createFilter()">Add a Filter</button>
    </div>
    </div>
    <div id="example-table"></div>`;
    createPokedex();    
}

var moveData = {}
var table;
var pokemonData = new Array();

function createMoveTable(data, column)
{
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
    window.moveTable.on("tableBuilt", function()
    {
        var moves = data["Moves"].split(",");
        var pkmnMoves = new Array();
        for(var move of moves)
        {
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

function createPokedex()
{
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
        if(pokemonData.length == 0)
        {
            $.getJSON("pokemon.json", function( data ) 
            {      
                pokemonData = fixDoubleDamageFrom(data);
                console.debug(data);
                refreshPokedexTableData();
            });
            $.getJSON("moves.json", function( data ) 
            {      
                data.forEach(x=>
                {
                    moveData[x.Name] = x;            
                })      
            });
        }
        else
        {
            refreshPokedexTableData();
        }
    });

    table.on("rowClick", function(e, row)
    { 
        focusOnPokemon(row.getData());
    });
}

function refreshPokedexTableData()
{
    table.setData(pokemonData)
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

createPokedex();

//trigger an alert message when the row is clicked


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

var filterId = 0;
var filters = 
{
    "Resists" : resists,
    "Immune To": immuneTo,
    "Weak To" : weakTo,
    "Is Not Weak To" : isNotWeakTo,
    "Has Damaging Move" : hasDamagingMove,
    "Has Type" : hasType
};

function buildFilterOptions()
{
    var options = "";
    Object.keys(filters).forEach(function(key)
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
        var filterPokemonType = document.getElementById("filter-pokemon-type-" + i).value;  
        var filterField = filterFieldElement.value;      
        var filter = filters[filterField];
        var filterParams =
        {
            type: filterPokemonType
        };
        filterList.push({filter:filter, params:filterParams});
    }
    compose = (data,params)=>
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
      <select id="filter-field-` + filterId +`" onChange="updateFilter()">`
      + buildFilterOptions() + `
      </select> 

      <label>Type</label>
      <select id="filter-pokemon-type-` + filterId +`" onChange="updateFilter()">
        ` + buildTypeOptions() +
      `</select>  
      <button id="filter-clear" onClick="removeFilter(event)">Remove Filter</button>
    `;
    filterId++;
    var div = document.createElement("div");
    div.innerHTML = filterHTML;
    document.getElementById("filters").appendChild(div);
    updateFilter();
}