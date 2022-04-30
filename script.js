//function to search movie based on query

const BASE_URL="https://api.themoviedb.org/3/"
const API_KEY='c033eb014bf4b8df7cb9e8afbfc906c3';
const IMGPATH= 'https://image.tmdb.org./t/p/w1280';

async function searchMovieHandler(){
    //get the query
    let userQuery= document.getElementById('query-input').value;
    if(userQuery){
        //search movie API
        let response = await fetch(`${BASE_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${userQuery}&page=1&include_adult=false`)
        parsedResponse = await response.json();
        let movieResponse= [];   //store the  response array in movieResponse[]
        movieResponse= parsedResponse.results;
        
        let moviesListBox= document.getElementById('movies-list');   //get the list
        //add the movies to list
        for(let i=0; i<movieResponse.length; i++){  //iterating the array we get in response
             let newListItem= document.createElement("li");  //creating new list item

             //create and add poster image
             let movieImageBox = document.createElement("img")
             movieImageBox.setAttribute("src", `${IMGPATH}${movieResponse[i].poster_path}`)
             movieImageBox.setAttribute("height", "300px");
             movieImageBox.setAttribute("width", "300px");
             newListItem.append(movieImageBox);

             //create a title and like button box
             let captionBox = document.createElement("div");

             let movieTitleBox = document.createElement("span")  //creating  span for title of movie(movie name)
             
             movieTitleBox.innerText = movieResponse[i].title;  //inserting title from array in span
             newListItem.append(movieTitleBox);  //appending the span to list
             


             //create and add favourite button
             let movieFavButton= document.createElement("button");
             movieFavButton.innerHTML= '<i class="fa-brands fa-gratipay"></i>' ;
             movieFavButton.setAttribute("onclick", `addMovieToFavourite(${movieResponse[i].id})`);
             newListItem.append(movieFavButton);

             //add button and span to div
             captionBox.append(movieTitleBox, movieFavButton);
             newListItem.append(captionBox);
             moviesListBox.append(newListItem);  //appeding list to ul
        }
         console.log(">>>>>>", parsedResponse)

    }
}
function addMovieToFavourite(movieId){
    let favouriteList= localStorage.getItem("fav-movies"); //if already some item present and saved in local Storage

    if(favouriteList){  // favourite list already exist, add into that
        let movieIdArray= JSON.parse(favouriteList); //string to object

        if(movieIdArray.findIndex((val)=> val === movieId)=== -1){  //to eliminate duplicates of arr element in fav list.
            // -1 when element is not present in the movieIdArray
            movieIdArray.unshift(movieId);   //adds one or more element to the begining of array
        }
        
        localStorage.setItem('fav-movies', JSON.stringify(movieIdArray));
    }
    else{    // if fav list not exist, create new one
        let movieIdArray=[];
        movieIdArray.push(movieId);
        localStorage.setItem('fav-movies', JSON.stringify(movieIdArray));
    }
}
function removeMovieFromFavourite(movieId){
    let favouriteList= localStorage.getItem("fav-movies");
    let movieIdArray= JSON.parse(favouriteList); //string to object
        let currentMovieIndex= movieIdArray.findIndex((val)=> val === movieId);
        movieIdArray.splice(currentMovieIndex, 1); //splice(start index, delete count)
        
        localStorage.setItem('fav-movies', JSON.stringify(movieIdArray));
    //reset the list after removing
    resetList();
    //call favrouritev function again
    addFavouriteMoviesToList();

}
// Show Favourite from the fav list
async function addFavouriteMoviesToList(){
    let favouriteList= localStorage.getItem("fav-movies");
   
    if(favouriteList){
        let movieIdArray= JSON.parse(favouriteList);
        let moviesListBox = document.getElementById("fav-movies-list");

        for(let index=0; index< movieIdArray.length; index++){
            const movieId= movieIdArray[index];
            let movieResponse= await fetch(`${BASE_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`);
            movieResponse= await movieResponse.json();
            let newListItem=document.createElement("li");

            //create and add poster image
            let movieImageBox = document.createElement("img")
            movieImageBox.setAttribute("src", `${IMGPATH}${movieResponse.poster_path}`)
            movieImageBox.setAttribute("height", "300px");
            movieImageBox.setAttribute("width", "300px");

            newListItem.append(movieImageBox);

            //create a title and like button box
            let captionBox = document.createElement("div");

            let movieTitleBox = document.createElement("span")  //creating  span for title of movie(movie name)
            
            movieTitleBox.innerText = movieResponse.title;  //inserting title from array in span
            newListItem.append(movieTitleBox);  //appending the span to list


             //create and add remove favourite button
             let movieFavButton= document.createElement("button");
             movieFavButton.innerHTML= '<i class="fa-solid fa-xmark"></i>' ;
             movieFavButton.setAttribute("onclick", `removeMovieFromFavourite(${movieResponse.id})`);
             newListItem.append(movieFavButton);

             captionBox.append(movieTitleBox, movieFavButton);
             newListItem.append(captionBox);

            moviesListBox.append(newListItem);  //appeding list to ul
       
        }
    }
}

//when you delete or remove the item from favourite list, it should reset the list
function resetList(){
    let favMovieBox= document.getElementById("inner-fav-movie-box");
    let favMovieList= document.getElementById("fav-movies-list");
 
    favMovieBox.removeChild(favMovieList);  //removeChild(node) method removes a chile(node) from DOM and return the child

    let newFavMovieList = document.createElement("ul");
    newFavMovieList.setAttribute("id", "fav-movies-list");
    favMovieBox.append(newFavMovieList);
}