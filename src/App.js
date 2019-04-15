import React from 'react';
import Quotes from './Components/Quotes';
import Rating from './Components/Rating';
import './App.css'

/*constant used to adjust the number of quotes that we get back from the swanson API at a time*/ 
const numQuotes = 10

class App extends React.Component{
    constructor(props){
        super(props); 
        this.state ={
            quote: 'Click the button to get a quote!', 
            size: '',
            rating: 0,
            userRating: '1',
            alreadyRatedMsg: ''
        };
        this.getQuote = this.getQuote.bind(this);
        this.updateSize = this.updateSize.bind(this);
        this.getRating = this.getRating.bind(this); 
        this.rateQuote = this.rateQuote.bind(this);
        this.updateRating = this.updateRating.bind(this) 
    }




    getQuote = async (e)=>{
        /*creates a request object and sends HTTP GET request to the Swanson API to get a list of 10 quotes.
        Then finds a quote that fits the size parameter and sets the state to the matched quote.
        If no quote if found, another call to the api. 
        This repeats until quote that fits the params is found*/

        e.preventDefault()
        
        this.setState({
            alreadyRatedMsg: ''
        })

        while (true){
            const api_val = await fetch('https://ron-swanson-quotes.herokuapp.com/v2/quotes/' + numQuotes)
            .then(data => data.json())
            .catch(error => console.error(`Error: ${error}`))
        
            const objectSize = {
                'small': [1,4],
                'medium': [5, 12],
                'large': [13, Number.MAX_SAFE_INTEGER]
            }

            const min = objectSize[this.state.size][0]
            const max = objectSize[this.state.size][1]
            
            for (let i=0; i<api_val.length; i++){
                const wordsInQuote = api_val[i].split(' '); 
                const numOfWords = wordsInQuote.length; 
                if ((min <= numOfWords  && numOfWords <= max) && api_val[i] !== this.state.quote){
                    this.getRating(api_val[i])
                    this.setState({
                        quote: api_val[i]
                    })
                    return 
                }
            }
    }
}




    updateSize(e){
        /*Updates the state of size whenever a new size button is changed by user*/
        const size = e.target.value 
        this.setState({
            size: size 
        })
    }




    getRating = async(quote) =>{
        /*Builds a request object and sends an HTTP POST request to endpoint at /average.
        A rating for the quote is sent back from enpoint, and the rating state is updated with the new rating.*/
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        
        const options = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({"quote": quote})
        }

        const request = new Request('http://52.15.228.236:5000/average', options)
       
        let newRating;

        await fetch(request)
        .then(response=> response.json())
        .then(rating => newRating = rating["rating"])
        .catch(error => console.error(`Error : ${error}`))
        
        this.setState({
            rating: newRating
        })
    }




    rateQuote = async (e)=>{
        /*Creates a request object and sends an HTTP POST request to /rate endpoint.
        Rate endpoint sends back 200 if rating was applied, or 204 if ip address has already rated this quote.
        On 200 getRating() is called on 200 to update rating and user gets success response. 
        On 204, the user is notified that their computer has already rated that quote.*/
        e.preventDefault()

        const rating = this.state.userRating; 
        const quote = this.state.quote; 
        
        const myHeaders = new Headers(); 
        myHeaders.append('Content-Type', 'application/json'); 

        const options = {
            method: 'POST', 
            headers: myHeaders,
            body: JSON.stringify({"quote": quote, "rating": rating})
        }
        
        const request = new Request('http://52.15.228.236:5000/rate', options)

        let successConfirm; 

        await fetch(request)
        .then(response => response.json())
        .then(obj => successConfirm = obj["status"])
        .catch(error => console.error(`Error: ${error}`))

        if (Number(successConfirm) === 200){
            this.getRating(quote)
            this.setState({
                alreadyRatedMsg: "Rating Submitted!"
            })
        }

        else if (Number(successConfirm) === 204){
            this.setState({
                alreadyRatedMsg: "Sorry! This quote has already been rated from this computer"
            })
        }
    }



    
    updateRating(e){
        /*Updates the userRating state whenver a new rating is selected from the rating dropdown*/
        const userRating = e.target.value; 
        
        this.setState({
            userRating: userRating
        })
    }




    render(){
        return (
            <div>
                <div className="renderQuote">
                <Quotes 
                getQuote={this.getQuote} 
                updateSize = {this.updateSize}
                quote={this.state.quote} 
                rating={this.state.rating}
                />
                </div>
                <p id="ratingResponse">{this.state.alreadyRatedMsg}</p>

                <Rating 
                rateQuote={this.rateQuote}
                updateRating={this.updateRating}
                />
            </div>
        );
    }
}

export default App; 