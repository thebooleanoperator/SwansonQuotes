import React from 'react';
import StarRatingComponent from 'react-star-rating-component'; 
import './Quotes.css'; 

class Quotes extends React.Component{
    render(){
        return (
            <form className="quoteRating" onSubmit={this.props.getQuote} onChange={this.props.updateSize}>
                <div className="swansonPic">
                    <img src="https://media.giphy.com/media/d7qFTitBNU9kk/giphy.gif" alt="swansonHead" height="200"/>
                </div>
                <h4 id="sizeQuestion">How much Swanson do you want?</h4>
                <div className="sizeChoice">
                    <input id="small" type="radio" name="size" value="small"/>Small
                    <input id="medium" type="radio" name="size" value="medium"/>Medium
                    <input id="large" type="radio" name="size" value="large"/>Large<br/>
                </div>
                <br/>
                <button id="quoteButton" type="submit">Click to Get Quote!</button>
                <br/>
                <p id="quoteText"><strong id="quotePreface">Ron Says:</strong> "{this.props.quote}"</p>
                <p id = "ratingPreface">Rating:</p>
                <div id="starComponenet"><StarRatingComponent name="rate1" starCount={5} value={this.props.rating} emptyStarColor="lightgray" editing={false} /></div>
            </form> 
        );
    }
}

export default Quotes; 