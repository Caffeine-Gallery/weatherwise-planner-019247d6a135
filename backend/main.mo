import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Error "mo:base/Error";
import IC "mo:ic";

actor DailyPlanner {
    type Note = {
        id: Text;
        date: Int;
        content: Text;
        isCompleted: Bool;
    };

    stable var notesEntries : [(Text, Note)] = [];
    var notes = HashMap.HashMap<Text, Note>(0, Text.equal, Text.hash);

    system func preupgrade() {
        notesEntries := Iter.toArray(notes.entries());
    };

    system func postupgrade() {
        notes := HashMap.fromIter<Text, Note>(notesEntries.vals(), 1, Text.equal, Text.hash);
    };

    public func addNote(date: Int, content: Text) : async Text {
        let id = Int.toText(Time.now()) # Int.toText(date);
        let note : Note = {
            id = id;
            date = date;
            content = content;
            isCompleted = false;
        };
        notes.put(id, note);
        id
    };

    public query func getNotes() : async [Note] {
        Iter.toArray(notes.vals())
    };

    public func updateNoteStatus(id: Text, isCompleted: Bool) : async Result.Result<(), Text> {
        switch (notes.get(id)) {
            case (null) {
                #err("Note not found")
            };
            case (?note) {
                let updatedNote : Note = {
                    id = note.id;
                    date = note.date;
                    content = note.content;
                    isCompleted = isCompleted;
                };
                notes.put(id, updatedNote);
                #ok()
            };
        }
    };

    public func getWeatherForecast(location: Text) : async Text {
        let ic : IC.Service = actor("aaaaa-aa");
        let url = "https://api.openweathermap.org/data/2.5/weather?q=" # location # "&appid=YOUR_API_KEY&units=metric";
        
        let response = await ic.http_request({
            url = url;
            method = #get;
            body = null;
            headers = [];
            max_response_bytes = null;
            transform = null;
        });

        switch (Text.decodeUtf8(response.body)) {
            case (null) { "Error decoding response" };
            case (?decodedBody) { decodedBody };
        }
    };

    public func getDateTime(location: Text) : async Text {
        let ic : IC.Service = actor("aaaaa-aa");
        let url = "http://worldtimeapi.org/api/timezone/" # location;
        
        let response = await ic.http_request({
            url = url;
            method = #get;
            body = null;
            headers = [];
            max_response_bytes = null;
            transform = null;
        });

        switch (Text.decodeUtf8(response.body)) {
            case (null) { "Error decoding response" };
            case (?decodedBody) { decodedBody };
        }
    };
}
