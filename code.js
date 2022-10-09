//define some sample data
var tabledata = [
    {id:1, name:"Bulbasaur", Types:"Grass,Poison", HP:"45", Attack:"49",
    Defense:"49", SpecialAttack:"65", SpecialDefense:"65", Speed:"45", },
];

//create Tabulator on DOM element with id "example-table"
var table = new Tabulator("#example-table", {
    height:405, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
    data: tabledata,
    layout:"fitColumns", //fit columns to width of table (optional)
 	columns:[ //Define Table Columns
	 	{title:"Name", field:"name", width:150, frozen:true},
	 	{title:"Types", field:"Types", hozAlign:"left"},
         {title:"HP", field:"HP", formatter:"progress",
         min:0,
         max:255,
         color:["red", "orange", "yellow", "green", "blue"],},
         {title:"Attack", field:"Attack", formatter:"progress",
         min:0,
         max:255,
         color:["red", "orange", "yellow", "green", "blue"],},
         {title:"Defense", field:"Defense", formatter:"progress",
         min:0,
         max:255,
         color:["red", "orange", "yellow", "green", "blue"],},
         {title:"Special Attack", field:"Special Attack", formatter:"progress",
         min:0,
         max:255,
         color:["red", "orange", "yellow", "green", "blue"],},
         {title:"Special Defense", field:"Special Defense", formatter:"progress",
         min:0,
         max:255,
         color:["red", "orange", "yellow", "green", "blue"],},
         {title:"Speed", field:"Speed", formatter:"progress",
         min:0,
         max:255,
         color:["red", "orange", "yellow", "green", "blue"],},
 	]
});

//trigger an alert message when the row is clicked
table.on("rowClick", function(e, row){ 
   alert("Row " + row.getData().id + " Clicked!!!!");
});

table.on("tableBuilt", function()
{
    /*$.getJSON("pokemonTest.json", function( data ) 
    {
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
    });*/
});
