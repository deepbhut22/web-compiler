const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const path = require("path");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(bodyParser.json());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));


// Dcoded < stored hash for rust >
const rustHash = {
    easy: "5891b5b522d5df086d0ff0b110fbd9d21bb4fc7163af34d08286a2e846f6be03", // Dcoded < hello\n >
    medium: "46517e2b493c5efb6c0168d2ec80af92b0542de8fd3fc01e71ae92ddc42a4872", // Dcoded < hello 2+2 = 4\n >
    hard: "e9c6c2429e7f6304658b403276f0989d2bf87126a2374c635560e3cf8086e262", // Dcoded < hello 2*2 = 4 >
};


const solidityHash = {
    easy: "608060405234801561001057600080fd5b5060e38061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063ef5fb05b14602d575b600080fd5b604080518082018252600581526468656c6c6f60d81b6020820152905160529190605b565b60405180910390f35b600060208083528351808285015260005b81811015608657858101830151858201604001528201606c565b818111156097576000604083870101525b50601f01601f191692909201604001939250505056fea264697066735822122037491f707bcd8ac4faef157b11603e1226503ffd4efa02de3fc528cca35fff4f64736f6c63430008060033", //Dcoded < hello >
    medium: "608060405234801561001057600080fd5b5060eb8061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063ef5fb05b14602d575b600080fd5b604080518082018252600d81526c1a195b1b1bc80c8acc880f480d609a1b60208201529051605a91906063565b60405180910390f35b600060208083528351808285015260005b81811015608e578581018301518582016040015282016074565b81811115609f576000604083870101525b50601f01601f191692909201604001939250505056fea26469706673582212203fb5e0d18908a713eff9071d77735924a7afd486fba4ab456393149da18ea8dd64736f6c63430008060033", //Dcoded < hello 2+2 = 4 >
    hard: "608060405234801561001057600080fd5b5060eb8061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063ef5fb05b14602d575b600080fd5b604080518082018252600d81526c1a195b1b1bc80c8a8c880f480d609a1b60208201529051605a91906063565b60405180910390f35b600060208083528351808285015260005b81811015608e578581018301518582016040015282016074565b81811115609f576000604083870101525b50601f01601f191692909201604001939250505056fea2646970667358221220c5a11133c8bd5b60ca698dcc601aebac583a17262704f782a7a7d3d03f79a22164736f6c63430008060033", // Dcoded < hello 2*2 = 4 >
};

// Dcoded < Controller for handeling compilation request >
app.post("/compile", (req, res) => {

    // Dcoded < grabing data from request >
    const code = req.body.code;
    const language = req.body.language;
    const difficulty = req.body.difficulty;
    if (!code) {
        return res.status(400).send("No code provided.");
    }
    let scriptPath;
    
    // Dcoded < choosing appropriate shell script file according to language >
    if (language === "rust") {
        scriptPath = path.join(__dirname, "compile_rust.sh");
    } else if (language === "solidity") {
        scriptPath = path.join(__dirname, "compile_solidity.sh");
    } else {
        return res.status(400).json({message: "unsupported language."});
    }

    // Dcoded < exicuting shell script >
    exec(`bash ${scriptPath} '${code}'`, (error, stdout, stderr) => {
        if(stderr) {
            res.json({output: stderr, varify: false});
        }
        // Dcoded < giving response according to language >
        if (language === "solidity") {
            // console.log(JSON.parse(stdout).contracts["temp_code.sol:Solution"].bin);
            res.json({output: JSON.parse(stdout), verify: solidityHash[difficulty] === JSON.parse(stdout).contracts["temp_code.sol:Solution"].bin});
            return;
        }
        // Dcoded < using crypto to generate hash for generated output > 
        const op = crypto.createHash("sha256").update(stdout).digest("hex");
        res.json({output: stdout, verify: rustHash[difficulty] === op});
    });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
