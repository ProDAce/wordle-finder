/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import './App.css'
import OtpInputFields from './components/OtpInputFields';

function App() {
  const [filteredData, setFilteredData] = useState<string[]>([""]);
  const wordLength = 5;
  // const [wordLength, setWordLength] = useState(5);
  const [word, setWord] = useState<string | string[]>("");
  const [status, setStatus] = useState(Array(wordLength).fill(""));
  const [chance, setChance] = useState(6);

  useEffect(() => {
    handleReload();
  }, [wordLength])

  const handleReload = () => {
    setWord("".repeat(wordLength));
    setStatus(Array(wordLength).fill(""));
    setChance(6);
    import("./assets/words.json")
      .then((module) => {
        setFilteredData(module.data5)
      })
      .catch((error) => console.error('Error loading JSON:', error));
  }

  const handleOnChange = (otp: string | string[]) => {
    setWord(otp)
  }

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    setStatus((prev) => {
      const temp = [...prev];
      temp[index] = event.target.value
      return temp;
    })
  }

  const handleCheck = () => {
    const grey: { [key: string]: number[] } = {};
    const yellow: { [key: string]: number[] } = {};
    const green: { [key: string]: number[] } = {};

    for (let i = 0; i < wordLength; i++) {
      if (status[i] === "Z") {
        if (green[word[i]]) {
          green[word[i]].push(i);
        } else {
          green[word[i]] = [i];
        }
      } else if (status[i] === "C") {
        if (yellow[word[i]]) {
          yellow[word[i]].push(i);
        } else {
          yellow[word[i]] = [i];
        }
      } else {
        if (grey[word[i]]) {
          grey[word[i]].push(i);
        } else {
          grey[word[i]] = [i];
        }
      }
    }

    const temp: string[] = [];
    for (const word of filteredData) {
      let flag = true;
      for (const g in green) {
        for (const i of green[g]) {
          if (word[i] !== g) {
            flag = false;
            break;
          }
        }
        if (!flag) {
          break;
        }
      }
      if (!flag) {
        continue;
      }
      for (const y in yellow) {
        if (!word.includes(y)) {
          flag = false;
          break;
        }
        for (const i of yellow[y]) {
          if (word[i] === y) {
            flag = false;
            break;
          }
        }
        if (!flag) {
          break;
        }
      }
      if (!flag) {
        continue;
      }
      for (const g in grey) {
        if (!green[g] && !yellow[g] && word.includes(g)) {
          flag = false;
          break;
        } else if (green[g] && word.includes(g)) {
          for (const x of green[g]) {
            if (word[x] !== g) {
              flag = false;
              break;
            }
          }
          if (!flag) {
            break;
          }
          for (const x of grey[g]) {
            if (word[x] === g) {
              flag = false;
              break;
            }
          }
          if (!flag) {
            break;
          }
        } else if (yellow[g] && word.includes(g)) {
          for (const x of yellow[g]) {
            if (word[x] === g) {
              flag = false;
              break;
            }
          }
          if (!flag) {
            break;
          }
          for (const x of grey[g]) {
            if (word[x] === g) {
              flag = false;
              break;
            }
          }
          if (!flag) {
            break;
          }
        }
      }
      if (flag) {
        temp.push(word);
      }
    }
    // filteredData = temp;
    console.log(temp);
    setFilteredData(temp)
    setWord("".repeat(wordLength));
    setStatus(Array(wordLength).fill(""));
    setChance(prev => { return prev - 1 });
  }

  const renderStatus = () => {
    const arr = [];
    for (let i = 0; i < wordLength; i++) {
      arr.push(
        <div className="status-div" key={i}>
          <input type="checkbox" name={"status" + i} id={"status" + i + "-1"} value="Z" onChange={(e) => handleStatusChange(e, i)} checked={status[i] === "Z"} style={{ accentColor: "#538D4E" }} />
          <input type="checkbox" name={"status" + i} id={"status" + i + "-2"} value="C" onChange={(e) => handleStatusChange(e, i)} checked={status[i] === "C"} style={{ accentColor: "#b59f3b" }} />
          <input type="checkbox" name={"status" + i} id={"status" + i + "-3"} value="X" onChange={(e) => handleStatusChange(e, i)} checked={status[i] === "X"} style={{ accentColor: "#3A3A3C" }} />
        </div>
      )
    }
    return arr;
  }

  const renderWords = () => {
    if (chance != 6) {
      return filteredData.map(obj => {
        return <div key={obj} className="suggestions-words" onClick={() => setWord(obj)}>{obj}</div>
      })
    }
  }

  return (
    <>
      <header>Wordle Finder</header>
      <div className="container">
        <section className="suggestions-section">
          <div className="suggestions-title">Suggestions/Possible Solutions</div>
          <div className="suggestions-content">
            {renderWords()}
          </div>

        </section>
        <section className="wordle-section">
          <button onClick={handleReload} className="btn-reset">Reset</button>
          {/* <div className="length-div">
            <label htmlFor="length-inp">Length: </label>
            <input type="number" min={5} max={8} name="length-inp" id="length-inp" value={wordLength} onChange={(e) => setWordLength(Number(e.target.value))} />
          </div> */}
          <div className="length-div">
            <label>Chance: </label>
            <label style={{ marginLeft: "8px" }}>{chance}</label>
          </div>
          <div style={{ marginBottom: "24px" }}>
            <OtpInputFields length={wordLength} inputType="text" case="upper" onChange={handleOnChange} value={word} />
            <div className="status-container">
              {renderStatus()}
            </div>
          </div>
          <button disabled={word.length != wordLength || status.filter(x => x !== "").length != wordLength} onClick={handleCheck} className="btn-check">Check</button>
        </section>
      </div>
    </>
  )
}

export default App
