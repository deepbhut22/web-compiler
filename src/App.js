import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import axios from 'axios';
import './App.css'; // Import your CSS file for styling

const App = () => {
  
  const solidityDefaultCode = 
`pragma solidity ^0.8.0;

contract Solution {
  function sayHello() public pure returns (string memory) {
    return "Deep Bhut";
  }
}`;

  const rustDefaultCode =
`fn main() {
  // Your Code Goes Here
}`

  const expectedOutput = {
    easy: "hello",
    medium: "hello 2+2 = 4",
    hard: "hello 2*2 = 4",
}

  const [language, setLanguage] = useState('rust');
  const [difficulty, setDifficulty] = useState('easy');
  const [code, setCode] = useState(rustDefaultCode);
  const [output, setOutput] = useState("");
  const [verified, setVerified] = useState(Boolean);
  const [totalPoints, setTotalPoints] = useState(0);

  const temp = {
    easy: 1,
    medium: 2,
    hard: 3,
  };

  const compileCode = async () => {
    try {
      // Dcoded < Making request to backend for compiling the code >
      const response = await axios.post('http://localhost:5000/compile', { language, code, difficulty });
      // console.log(response);

      // Dcoded < Setting output according to the language >
      if (language === "solidity") {
        const output = response.data.output.contracts["temp_code.sol:Solution"];
        setOutput("bin string : " + output.bin);
        setVerified(response.data.verify);
        response.data.verify === true && setTotalPoints(prev => prev + temp[difficulty]);
        return;
      }
      const output = response.data.output;
      setVerified(response.data.verify);
      setOutput(output);
      response.data.verify === true && setTotalPoints(prev => prev + temp[difficulty]);
      // Dcoded < Setting varified or not, according to response >
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  // Dcoded < changing the selected language >
  const changeLang = (e) => {
    setLanguage(e.target.value);
    if (e.target.value === "rust")
      setCode(rustDefaultCode);
    else
      setCode(solidityDefaultCode);
  };

  return (
    <div className="App">
      <h1 className="title">DcodeBlock internship assignment - 1</h1>
      <div className="dropdowns">
        <div className="lang">
          <label>Language: </label>
          <select value={language} onChange={e => changeLang(e)}>
            <option value="solidity">Solidity</option>
            <option value="rust">Rust</option>
          </select>
        </div>
        <div className="difficulty">
          <label>Difficulty: </label>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <p className='expop'>Expected Output : {expectedOutput[difficulty]}  </p>
      </div>
      <div className="workspace">
        <div className="editor">
          {/* Dcoded < Code for editor > */}
          <MonacoEditor
            language={language}
            value={code || (language === "rust" ? rustDefaultCode : solidityDefaultCode)}
            height={500}
            onChange={newValue => setCode(newValue)}
            options={{ selectOnLineNumbers: true }}
            theme="vs-dark"
          />
        </div>
        <div className="output">
          <div className="opHeading">
            <h3>Verified : {verified === true ? "Yes " : "No "}</h3>
            <h3>Points Earned : {
              verified === true ? difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3 : 0
            }</h3>
            <h3>Total points : {totalPoints}</h3>
          </div>  
          <div className="actualOp">
            <h2>Output:</h2>
            <p className='ppp'>{output}</p>
          </div>
        </div>
      </div>
      <button className="button" onClick={compileCode}>Compile</button>
      
    </div>
  );
};

export default App;
