/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import './App.css'
import OtpInputFields from './components/OtpInputFields';
import SvgIcons from './components/SvgIcons';

function App() {
  const LIGHT_COLOR = "#ffffff"
  const DARK_COLOR = "#000000"
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
    console.log("CHECK");

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

  const renderStatusHint = () => {
    return (
      <div style={{ marginLeft: "4px", marginRight: "4px", marginBottom: "32px" }}>
        <div className="row">
          <div className="row">
            <label className="label-checkbox first-checkbox">
              <input type="checkbox" checked={false} disabled={true} />
              <span>
                <SvgIcons name="check" color={DARK_COLOR} />
              </span>
            </label>
            |
            <label className="label-checkbox first-checkbox">
              <input type="checkbox" checked={true} disabled={true} />
              <span>
                <SvgIcons name="check" color={LIGHT_COLOR} />
              </span>
            </label>
          </div>
          <div style={{ flex: "1 1", fontSize: "14px", fontWeight: "normal" }}>
            Letters in the word and in the <strong>Correct </strong> position
          </div>
        </div>

        <div className="row">
          <div className="row">
            <label className="label-checkbox middle-checkbox">
              <input type="checkbox" checked={false} disabled={true} />
              <span>
                <SvgIcons name="circle" color={DARK_COLOR} />
              </span>
            </label>
            |
            <label className="label-checkbox middle-checkbox">
              <input type="checkbox" checked={true} disabled={true} />
              <span>
                <SvgIcons name="circle" color={LIGHT_COLOR} />
              </span>
            </label>
          </div>
          <div style={{ flex: "1 1", fontSize: "14px", fontWeight: "normal" }}>
            Letters in the word and in the <strong>Wrong </strong> position
          </div>
        </div>

        <div className="row">
          <div className="row">
            <label className="label-checkbox last-checkbox">
              <input type="checkbox" checked={false} disabled={true} />
              <span>
                <SvgIcons name="cross" color={DARK_COLOR} />
              </span>
            </label>
            |
            <label className="label-checkbox last-checkbox">
              <input type="checkbox" checked={true} disabled={true} />
              <span>
                <SvgIcons name="cross" color={LIGHT_COLOR} />
              </span>
            </label>
          </div>
          <div style={{ flex: "1 1", fontSize: "14px", fontWeight: "normal" }}>
            Letters are <strong>Not </strong> in the word(no duplicate if letter is already present).
          </div>
        </div>
      </div>
    )
  }

  const renderStatus = () => {
    const arr = [];
    for (let i = 0; i < wordLength; i++) {
      arr.push(
        <div className="status-div" key={i}>
          <label className="label-checkbox first-checkbox" htmlFor={"status" + i + "-1"}>
            <input type="checkbox" name={"status" + i} id={"status" + i + "-1"} value="Z" onChange={(e) => handleStatusChange(e, i)} checked={status[i] === "Z"} style={{ accentColor: "#538D4E" }} />
            <span className="first-span">
              <SvgIcons name="check" color={status[i] === "Z" ? LIGHT_COLOR : DARK_COLOR} />
            </span>
          </label>
          <label className="label-checkbox middle-checkbox" htmlFor={"status" + i + "-2"}>
            <input type="checkbox" name={"status" + i} id={"status" + i + "-2"} value="C" onChange={(e) => handleStatusChange(e, i)} checked={status[i] === "C"} style={{ accentColor: "#b59f3b" }} />
            <span className="middle-span">
              <SvgIcons name="circle" color={status[i] === "C" ? LIGHT_COLOR : DARK_COLOR} />
            </span>
          </label>
          <label className="label-checkbox last-checkbox" htmlFor={"status" + i + "-3"}>
            <input type="checkbox" name={"status" + i} id={"status" + i + "-3"} value="X" onChange={(e) => handleStatusChange(e, i)} checked={status[i] === "X"} style={{ accentColor: "#6a6a7c" }} />
            <span className="last-span">
              <SvgIcons name="cross" color={status[i] === "X" ? LIGHT_COLOR : DARK_COLOR} />
            </span>
          </label>
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
          {/* <SvgIcons name="check" color="#ff00ff"/> */}
          <div className="suggestions-title">Suggestions/Possible Solutions</div>
          <div className="suggestions-content">
            {renderWords()}
          </div>

        </section>
        <section className="wordle-section">
          <button onClick={handleReload} className="btn-reset">
            Reset <SvgIcons name="reset" color={LIGHT_COLOR} />
          </button>
          {/* <div className="length-div">
            <label htmlFor="length-inp">Length: </label>
            <input type="number" min={5} max={8} name="length-inp" id="length-inp" value={wordLength} onChange={(e) => setWordLength(Number(e.target.value))} />
          </div> */}
          <div className="length-div">
            <label>Chance: </label>
            <label style={{ marginLeft: "8px" }}>{chance}</label>
          </div>
          {renderStatusHint()}
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
