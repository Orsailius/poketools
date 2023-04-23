var moveData = new Array();

const useMoveData = async function() 
{
    if(moveData.length != 0)
    {
        return moveData;
    }
    const response = await fetch('/moves.json');
    const data = await response.json();
    data.forEach(x=>
    {
        moveData[x.Name] = x;            
    })    
    return moveData;
}

export default useMoveData;