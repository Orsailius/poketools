//define some sample data
var tabledata = [
    {id:1, name:"Bulbasaur", Types:"Grass,Poison", Speed:"45"},
];

//create Tabulator on DOM element with id "example-table"
var table = new Tabulator("#example-table", {
    height:405, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
    data: tabledata,
    layout:"fitColumns", //fit columns to width of table (optional)
 	columns:[ //Define Table Columns
	 	{title:"Name", field:"name", width:150, frozen:true},
	 	{title:"Types", field:"Types", hozAlign:"left"},
         {title:"Speed", field:"Speed", hozAlign:"left",
         min:0,
         max:255,
         color:["green", "orange", "red"],},
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
