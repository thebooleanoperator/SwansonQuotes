import React from 'react';
import StarRatingComponent from 'react-star-rating-component'; 
import './Quotes.css'; 

class Quotes extends React.Component{
    render(){
        return (
            <form className="quoteRating" onSubmit={this.props.getQuote} onChange={this.props.updateSize}>
                <img id="ronThinking" src="https://i.pinimg.com/236x/d3/c3/ba/d3c3ba09f7cdc33098eab932224bdea8--parks-and-recreation-ron.jpg?b=t" alt="ron thinking"/>
                <div className="sizeChoice" id="s">
                    <label><input id="small" type="radio" name="size" value="small"/>Small</label>
                    <label><input id="medium" type="radio" name="size" value="medium"/>Medium</label>
                    <label><input id="large" type="radio" name="size" value="large"/>Large</label>
                    <p id="userInfo">(choose the size of the quote)</p>
                    <p id="quoteText">"{this.props.quote}"</p>
                    <div id="starComponenet"><StarRatingComponent name="rate1" starCount={5} value={this.props.rating} emptyStarColor="lightgray" editing={false} /></div>
                </div>
                <br/>
                <button id="quoteButton" type="submit">Get Quote!</button>
                <br/>             
            </form> 
        );
    }
}

export default Quotes; 