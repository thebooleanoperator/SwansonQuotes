from flask import Flask, jsonify, request 
from flask_restful import Api, Resource 
from flask_cors import CORS 
from pymongo import MongoClient 

app = Flask(__name__)
CORS(app)

app.debug = True 
api = Api(app)

client = MongoClient("localhost", 27017)
db = client.SwansonQuotesDB 
quotedb = db["quotedb"] 

def quoteExists(q):
    if quotedb.find_one({"quote": q}) is None:
        return False 
    else:
        return True 


def getAvgRating(q):
    average = quotedb.find_one({"quote": q})["rating"]
    
    return average


def addRatingToDB(q, r, ip): 
    """
    If a the quote is not already in the DB, a new document is created.
    If the quote exists, add to rolling count and sum, and add ip address to list of IP's 
    Updates the rating key with new "sum" and "count" 
    """
    if quotedb.find_one({"quote": q}) is None:
        quotedb.insert_one({"quote": q, "count": 1, "rating": int(r), "sum":int(r), "ip": [ip]})
    
    else:
        quotedb.update({"quote": q},{"$inc": {"count": 1, "sum": int(r)}, {"$push": {"ip": ip}})

    cursor = quotedb.find_one({"quote": q})

    quotedb.update({"quote": q}, {"$set": {"rating": cursor["sum"] // cursor["count"]}}) 



def checkIp(ip, q):
    cursor = quotedb.find_one({"quote": q})

    if cursor is None:
        return False

    ipList = cursor["ip"]
    return ip in ipList  



class AverageRating(Resource):
    def post(self):
        """
        A POST endpoint that returns a quotes rating if it is in the DB.
        Returns "This quote has not been rated yet!" if quote is not in DB. 
        """
        data = request.get_json()
        
        quote = data["quote"]
        
        exists = quoteExists(quote)
        
        if not exists:
            retJson = {
                "rating": 0
            }
            return jsonify(retJson)

        rating = getAvgRating(quote)

        retJson = {
            "rating": rating 
        }

        return jsonify(retJson)



class AddRating(Resource):
    def post(self):
        """
        A POST endpoint that adds a rating to the quote document.
        Sends back a 200 response if the rating was added to DB.
        Sends back a 204 response if the IP address already rated that quote. 
        """
        data = request.get_json()

        ip = (request.environ['REMOTE_ADDR'])
    
        quote = data["quote"]
        rating = data["rating"]
        
        alreadyRated = checkIp(ip, quote)

        if alreadyRated:
            retJson = {
                "status": 204
            }
            return jsonify(retJson)
        
        addRatingToDB(quote, rating, ip)

        retJson ={
            "status": 200
        }

        return jsonify(retJson)


  
api.add_resource(AverageRating, '/average')
api.add_resource(AddRating, '/rate')

if __name__=="__main__":
    app.run(host='0.0.0.0')
        


