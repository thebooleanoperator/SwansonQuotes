import React from 'react'; 
import './Rating.css'

class Rating extends React.Component{
    render(){
        return (
            <form className="ratings" onSubmit={this.props.rateQuote}>
                <h4 id="ratingQHeader">Rate Ron's Wisdom:</h4>
                    <select className="ratingDropdown" onChange={this.props.updateRating}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select><br/>
                    <button id ="subButton" type="submit">Rate Quote</button>
            </form>
        );
    }
}

export default Rating; 