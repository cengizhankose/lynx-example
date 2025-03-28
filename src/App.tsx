import { useState, useCallback, useEffect } from "@lynx-js/react";
import "./App.css";

// Performance Test Screen Component
const PerformanceTestScreen = () => {
  const [boxCount, setBoxCount] = useState(100000); // Start with 100k boxes
  const [boxes, setBoxes] = useState<Array<{ id: number; color: string }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [progress, setProgress] = useState(0);

  const generateBoxes = useCallback((count: number) => {
    setIsGenerating(true);
    setStatus(`Generating ${count} boxes...`);
    setProgress(0);

    // Use setTimeout to avoid blocking the UI thread
    setTimeout(() => {
      const newBoxes: Array<{ id: number; color: string }> = [];
      const batchSize = Math.min(10000, Math.floor(count / 10));

      const generateBatch = (startIdx: number) => {
        const endIdx = Math.min(startIdx + batchSize, count);

        for (let i = startIdx; i < endIdx; i++) {
          const randomColor =
            "#" + Math.floor(Math.random() * 16777215).toString(16);
          newBoxes.push({ id: i, color: randomColor });
        }

        const currentProgress = Math.min(
          100,
          Math.floor((endIdx / count) * 100)
        );
        setProgress(currentProgress);

        if (endIdx < count) {
          // Process next batch
          setTimeout(() => generateBatch(endIdx), 0);
        } else {
          // Finished generating all boxes
          setBoxes(newBoxes);
          setIsGenerating(false);
          setStatus(`Generated ${count} boxes in `);
        }
      };

      // Start the first batch
      generateBatch(0);
    }, 100);
  }, []);

  const deleteBoxes = useCallback(() => {
    setBoxes([]);
    setStatus("Boxes deleted");
  }, []);

  return (
    <view className="performance-test">
      <view className="test-controls">
        <text className="test-title">Performance Test</text>
        <text className="test-status">{status}</text>
        {isGenerating && (
          <view className="progress-container">
            <view className="progress-bar" style={{ width: `${progress}%` }} />
            <text className="progress-text">{progress}%</text>
          </view>
        )}
        <view className="test-buttons">
          <view
            className={`test-button ${isGenerating ? "disabled" : ""}`}
            bindtap={() => !isGenerating && generateBoxes(10000)}
          >
            <text>10K Boxes</text>
          </view>
          <view
            className={`test-button ${isGenerating ? "disabled" : ""}`}
            bindtap={() => !isGenerating && generateBoxes(100000)}
          >
            <text>100K Boxes</text>
          </view>
          <view
            className={`test-button ${isGenerating ? "disabled" : ""}`}
            bindtap={() => !isGenerating && generateBoxes(1000000)}
          >
            <text>1M Boxes</text>
          </view>
          <view
            className={`test-button delete-button ${
              isGenerating || boxes.length === 0 ? "disabled" : ""
            }`}
            bindtap={() => !isGenerating && boxes.length > 0 && deleteBoxes()}
          >
            <text>Delete</text>
          </view>
        </view>
      </view>
      <scroll-view className="boxes-container" scroll-orientation="vertical">
        <view className="box-grid">
          {boxes.map((box) => (
            <view
              key={box.id}
              className="performance-box"
              style={{ backgroundColor: box.color }}
            />
          ))}
        </view>
      </scroll-view>
    </view>
  );
};

// Calculator Screen Component
const CalculatorScreen = () => {
  const [display, setDisplay] = useState("0");
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = useCallback(
    (digit: number) => {
      if (waitingForOperand) {
        setDisplay(String(digit));
        setWaitingForOperand(false);
      } else {
        setDisplay(display === "0" ? String(digit) : display + digit);
      }
    },
    [display, waitingForOperand]
  );

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  }, [display, waitingForOperand]);

  const clearDisplay = useCallback(() => {
    setDisplay("0");
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  }, []);

  const performOperation = useCallback(
    (nextOperator: string) => {
      const inputValue = parseFloat(display);

      if (prevValue === null) {
        setPrevValue(inputValue);
      } else if (operator) {
        const currentValue = prevValue || 0;
        let newValue = 0;

        switch (operator) {
          case "+":
            newValue = currentValue + inputValue;
            break;
          case "-":
            newValue = currentValue - inputValue;
            break;
          case "×":
            newValue = currentValue * inputValue;
            break;
          case "÷":
            newValue = currentValue / inputValue;
            break;
          case "=":
            newValue = inputValue;
            break;
        }

        setPrevValue(newValue);
        setDisplay(String(newValue));
      }

      setWaitingForOperand(true);
      setOperator(nextOperator);
    },
    [display, operator, prevValue]
  );

  return (
    <view className="calculator-screen">
      <view className="display">
        <text className="display-text">{display}</text>
      </view>
      <view className="keypad">
        <view className="key-row">
          <view className="key function" bindtap={() => clearDisplay()}>
            <text>AC</text>
          </view>
          <view
            className="key function"
            bindtap={() =>
              setDisplay(
                display.charAt(0) === "-" ? display.substr(1) : "-" + display
              )
            }
          >
            <text>+/-</text>
          </view>
          <view
            className="key function"
            bindtap={() => {
              const value = parseFloat(display);
              setDisplay(String(value / 100));
            }}
          >
            <text>%</text>
          </view>
          <view className="key operator" bindtap={() => performOperation("÷")}>
            <text>÷</text>
          </view>
        </view>
        <view className="key-row">
          <view className="key" bindtap={() => inputDigit(7)}>
            <text>7</text>
          </view>
          <view className="key" bindtap={() => inputDigit(8)}>
            <text>8</text>
          </view>
          <view className="key" bindtap={() => inputDigit(9)}>
            <text>9</text>
          </view>
          <view className="key operator" bindtap={() => performOperation("×")}>
            <text>×</text>
          </view>
        </view>
        <view className="key-row">
          <view className="key" bindtap={() => inputDigit(4)}>
            <text>4</text>
          </view>
          <view className="key" bindtap={() => inputDigit(5)}>
            <text>5</text>
          </view>
          <view className="key" bindtap={() => inputDigit(6)}>
            <text>6</text>
          </view>
          <view className="key operator" bindtap={() => performOperation("-")}>
            <text>-</text>
          </view>
        </view>
        <view className="key-row">
          <view className="key" bindtap={() => inputDigit(1)}>
            <text>1</text>
          </view>
          <view className="key" bindtap={() => inputDigit(2)}>
            <text>2</text>
          </view>
          <view className="key" bindtap={() => inputDigit(3)}>
            <text>3</text>
          </view>
          <view className="key operator" bindtap={() => performOperation("+")}>
            <text>+</text>
          </view>
        </view>
        <view className="key-row">
          <view className="key zero" bindtap={() => inputDigit(0)}>
            <text>0</text>
          </view>
          <view className="key" bindtap={() => inputDecimal()}>
            <text>.</text>
          </view>
          <view className="key operator" bindtap={() => performOperation("=")}>
            <text>=</text>
          </view>
        </view>
      </view>
    </view>
  );
};

// Main App Component with Navigation
export function App() {
  const [activeScreen, setActiveScreen] = useState<
    "calculator" | "performance"
  >("calculator");

  const renderScreen = () => {
    switch (activeScreen) {
      case "calculator":
        return <CalculatorScreen />;
      case "performance":
        return <PerformanceTestScreen />;
      default:
        return <CalculatorScreen />;
    }
  };

  return (
    <view className="app-container">
      <view className="screen-container">{renderScreen()}</view>
      <view className="bottom-navbar">
        <view
          className={`nav-item ${
            activeScreen === "calculator" ? "active" : ""
          }`}
          bindtap={() => setActiveScreen("calculator")}
        >
          <text>Calculator</text>
        </view>
        <view
          className={`nav-item ${
            activeScreen === "performance" ? "active" : ""
          }`}
          bindtap={() => setActiveScreen("performance")}
        >
          <text>Performance</text>
        </view>
      </view>
    </view>
  );
}
