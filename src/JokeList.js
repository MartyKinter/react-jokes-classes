import React, {useState, useEffect} from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

function JokeList({numJokesToGet = 5}){
    const [jokes, setJokes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(function (){
        async function getJokes(){
            let j = [...jokes];
            let seenJokes = new Set();
            try{
                while(j.length < numJokesToGet){
                    let res = await axios.get("https://icanhazdadjoke.com", {
                        headers: {Accept: "application/json"}
                    });
                    let{...jokeObj} = res.data;

                    if(!seenJokes.has(jokeObj.id)){
                        seenJokes.add(jokeObj.id);
                        j.push({...jokeObj, votes: 0});
                    }else{
                        console.error("duplicate found!");
                    }
                }

                setJokes(j);
                setIsLoading(false);
            }
            catch(err){
                console.error(err);
            }
        }
        if(jokes.length === 0) getJokes();
    }, [jokes, numJokesToGet]);

    //clears existing jokes then get new jokes
    function generateNewJokes(){
        setJokes([]);
        setIsLoading(true);
    }

    //upvote or downvote joke based on id
    function vote(id, delta){
        setJokes(allJokes =>
            allJokes.map(j => (j.id === id ? {...j, votes: j.votes + delta} : j))
        );
    }

    //either show loading spinner or jokes once they have loaded
    if(isLoading){
        return(
            <div className="loading">
                <i className="fas fa-4x fa-spinner fa-spin"/>
            </div>
        )
    }

    let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

    return(
        <div className="JokeList">
            <button className="JokeList-getmore" onClick={generateNewJokes}>
                Get new jokes
            </button>
            {sortedJokes.map(({joke, id, votes}) => (
                <Joke text={joke} key={id} id={id} votes={votes} vote={vote}/>
            ))}
        </div>
    );
}

export default JokeList;