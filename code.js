var pokemonTypes = 
[
    {
        name: "Normal",
        weakTo:"Fighting",
        resists:"",
        immuneTo: "Ghost"
    },
    {
        name: "Fire",
        weakTo:"Water,Ground,Rock",
        resists:"Fire,Grass,Ice,Bug,Steel,Fairy",
        immuneTo: ""
    },
    {
        name: "Water",
        resists:"Fire,Water,Ice,Steel",
        weakTo:"Electric,Grass",       
        immuneTo: ""
    },
    {
        name: "Electric",
        resists:"Electric,Flying,Steel",
        weakTo:"Ground",       
        immuneTo: ""
    },
    {
        name: "Grass",
        resists:"Water,Electric,Grass,Ground",
        weakTo:"Fire,Ice,Poison,Flying,Bug",       
        immuneTo: ""
    },
    {
        name: "Ice",
        resists:"Ice",
        weakTo:"Fire,Fighting,Rock,Steel",       
        immuneTo: ""
    },
    {
        name: "Fighting",
        resists:"Bug,Rock,Dark",
        weakTo:"Flying,Psychic,Fairy",       
        immuneTo: ""
    },
    {
        name: "Poison",
        resists:"Grass,Fighting,Poison,Bug,Fairy",
        weakTo:"Ground,Psychic",       
        immuneTo: ""
    },
    {
        name: "Ground",
        resists:"Poison,Rock",
        weakTo:"Water,Grass,Ice",       
        immuneTo: "Electric"
    },
    {
        name: "Flying",
        resists:"Grass,Fighting,Bug",
        weakTo:"Electric,Ice,Rock",       
        immuneTo: "Ground"
    },
    {
        name: "Psychic",
        resists:"Fighting,Psychic",
        weakTo:"Bug,Ghost,Dark",       
        immuneTo: ""
    },
    {
        name: "Bug",
        resists:"Grass,Fighting,Ground",
        weakTo:"Fire,Flying,Rock",       
        immuneTo: ""
    },
    {
        name: "Rock",
        resists:"Normal,Fire,Poison,Flying",
        weakTo:"Water,Grass,Fighting,Ground,Steel",       
        immuneTo: ""
    },
    {
        name: "Ghost",
        resists:"Poison,Bug",
        weakTo:"Ghost,Dark",       
        immuneTo: "Normal,Fighting"
    },
    {
        name: "Dragon",
        resists:"Fire,Water,Electric,Grass",
        weakTo:"Ice,Dragon,Fairy",       
        immuneTo: ""
    },
    {
        name: "Dark",
        resists:"Ghost,Dark",
        weakTo:"Fighting,Bug,Fairy",       
        immuneTo: "Psychic"
    },
    {
        name: "Steel",
        resists:"Normal,Grass,Ice,Flying,Psychic,Bug,Rock,Dragon,Steel,Fairy",
        weakTo:"Fire,Fighting,Ground",       
        immuneTo: "Poison"
    },
    {
        name: "Fairy",
        resists:"Fighting,Bug,Dark",
        weakTo:"Poison,Steel",       
        immuneTo: "Dragon"
    },
]



window.onload = (event) =>
{
    createFilter();
};

buildTypeOptions = function()
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
            s += "<a href='' class='pokemon-type pokemon-type-" + t.toLowerCase() + "'>" + t + "</a>";
        });
        return s + "</div>"
    },
});


//table.setFilter(customFilter, {height:3});

createStatColumnHeader  = function(title, field)
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

//create Tabulator on DOM element with id "example-table"
var table = new Tabulator("#example-table", {
    height:805, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
    layout:"fitColumns", //fit columns to width of table (optional)
 	columns:[ //Define Table Columns
	 	{title:"Name", field:"Name", width:150, frozen:true},
	 	{title:"Types", field:"Types", formatter:"pokemonTypes"},
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
        }}
 	]
});

//trigger an alert message when the row is clicked
/*table.on("rowClick", function(e, row){ 
   alert("Row " + row.getData().id + " Clicked!!!!");
});*/

var moveData = {}

table.on("tableBuilt", function()
{
    $.getJSON("pokemon.json", function( data ) 
    {      
        data = fixDoubleDamageFrom(data);
        console.debug(data);
        table.setData(data)
        .then(function()
        {
            console.debug("Successfully Set Data");
            //alert("Success!");
        })
        .catch(function(error)
        {
            console.debug("error");
            console.debug(error);
           //alert(error);
        });
    });
    $.getJSON("moves.json", function( data ) 
    {      
        data.forEach(x=>
        {
            moveData[x.Name] = x;            
        })      
    });
});

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

createFilter = function()
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