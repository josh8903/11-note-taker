const
    express = require("express"),
    path = require("path"),
    fs = require("fs"),
    app = express(),
    PORT = process.env.PORT || 3000;

let noteData = JSON.parse(fs.readFileSync("./db/db.json", "utf8"))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("public"))

// GET notes path
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
});

// GET api/notes path
app.get("/api/notes", function(req, res) {
    return res.json(noteData);
});

// GET 404 path - directs to index
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"))
});

// POST api/notes path
app.post("/api/notes", function(req, res) {
    let note = req.body,
        noteID = noteData.length
    note.id = noteID;
    noteData.push(note);
    writeFile()
    res.json(noteData);
});

// DELETE api/notes/:id path
app.delete("/api/notes/:id", function(req, res) {
    let noteID = req.params.id,
        newID = 0
    noteData = noteData.filter(noteIndex => noteIndex.id != noteID)
    for (noteIndex of noteData) {
        noteIndex.id = newID
        newID++;
    }
    writeFile()
    res.json(noteData)
});

// function to write db.json file
function writeFile() {
    return fs.writeFileSync("./db/db.json", JSON.stringify(noteData), function(err) {
        if (err) throw (err)
    });
}

// listener
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT)
});