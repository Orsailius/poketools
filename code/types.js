export var pokemonTypes = 
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