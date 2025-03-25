import React, { useState, useEffect, useMemo } from 'react';
import { Laptop2, Moon, Sun } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { MetricCard } from './components/MetricCard';
import { StatusIndicator } from './components/StatusIndicator';
import { useTheme } from './contexts/ThemeContext';
import type { ScoutField } from './types';

const scoutConfig = {
  title: "QRScout",
  page_title: "REEFSCAPE",
  delimiter: "\t",
  teamNumber: 120,
  sections: []
};

const prematchFields: ScoutField[] = [
  {
    title: "Scouter Initials",
    description: "Enter the initials of the scouter.",
    type: "text",
    required: true,
    code: "scouter",
    formResetBehavior: "preserve",
    defaultValue: ""
  },
  {
    title: "Match Number",
    description: "Enter the match number.",
    type: "number",
    required: true,
    code: "matchNumber",
    formResetBehavior: "increment",
    defaultValue: 1
  },
  {
    title: "Robot",
    description: "The robot you are scouting this match, based on driver station position.",
    type: "select",
    required: true,
    code: "robot",
    formResetBehavior: "preserve",
    defaultValue: "R1",
    choices: {
      "R1": "Red 1",
      "R2": "Red 2",
      "R3": "Red 3",
      "B1": "Blue 1",
      "B2": "Blue 2",
      "B3": "Blue 3"
    }
  },
  {
    title: "Team Number",
    description: "The team number of the robot you're scouting.",
    type: "number",
    required: true,
    code: "teamNumber",
    formResetBehavior: "reset",
    defaultValue: 0,
    min: 0,
    max: 19999
  },
  {
    title: "Starting Position",
    description: "The starting position of the robot.",
    type: "select",
    required: true,
    code: "Prsp",
    formResetBehavior: "reset",
    defaultValue: "",
    choices: {
      "R1": "Processor Side",
      "R2": "Middle",
      "R3": "Non-Processor Side"
    }
  },
  {
    title: "No Show",
    description: "Check if the robot did not show up for the match.",
    type: "boolean",
    required: false,
    code: "noShow",
    formResetBehavior: "reset",
    defaultValue: false
  },
  {
    title: "Cage Position",
    description: "The starting level of the cage",
    type: "select",
    required: true,
    code: "CPos",
    formResetBehavior: "reset",
    defaultValue: "",
    choices: {
      "SP1": "High",
      "SP2": "Low"
    }
  }
];

const autonomousFields: ScoutField[] = [
  {
    title: "Moved?",
    description: "Check if the robot moved during autonomous.",
    type: "boolean",
    required: false,
    code: "Mved",
    formResetBehavior: "reset",
    defaultValue: false
  },
  {
    title: "Timer",
    description: "The time it took for the robot to finish autonomous.",
    type: "timer",
    required: false,
    code: "timer",
    formResetBehavior: "reset",
    defaultValue: 0,
    outputType: "average"
  },
  {
    title: "Coral L1 Scored",
    description: "The number of level 1 coral scored during autonomous.",
    type: "counter",
    required: false,
    code: "CLOA",
    formResetBehavior: "reset",
    defaultValue: 0,
    min: 0,
    step: 1
  },
  {
    title: "Coral L2 Scored",
    description: "The number of level 2 coral scored during autonomous.",
    type: "counter",
    required: false,
    code: "CLTA",
    formResetBehavior: "reset",
    defaultValue: 0,
    min: 0,
    step: 1
  },
  {
    title: "Coral L3 Scored",
    description: "The number of level 3 coral scored during autonomous.",
    type: "counter",
    required: false,
    code: "CLThA",
    formResetBehavior: "reset",
    defaultValue: 0,
    min: 0,
    step: 1
  },
  {
    title: "Coral L4 Scored",
    description: "The number of level 4 coral scored during autonomous.",
    type: "counter",
    required: false,
    code: "CLFA",
    formResetBehavior: "reset",
    defaultValue: 0,
    min: 0,
    step: 1
  },
  {
    title: "Barge Algae Scored",
    description: "The number of Algae scored in the barge during autonomous.",
    type: "counter",
    required: false,
    code: "BASA",
    formResetBehavior: "reset",
    defaultValue: 0,
    min: 0,
    step: 1
  },
  {
    title: "Processor Algae Scored",
    description: "The number of Algae scored in the processor during autonomous.",
    type: "counter",
    required: false,
    code: "PASA",
    formResetBehavior: "reset",
    defaultValue: 0,
    min: 0,
    step: 1
  },
  {
    title: "Intentionally Removed Algae?",
    type: "boolean",
    required: false,
    code: "dto",
    formResetBehavior: "reset",
    defaultValue: false
  },
  {
    title: "Auto Foul",
    type: "counter",
    required: false,
    code: "auf",
    formResetBehavior: "reset",
    defaultValue: 0,
    min: 0,
    step: 1
  }
];

const teleopFields: ScoutField[] = [
  {
    title: "Intentionally Removed Algae?",
    type: "boolean",
    required: false,
    code: "daT",
    formResetBehavior: "reset",
    defaultValue: false
  },
  {
    title: "Pickup Location",
    type: "select",
    required: false,
    code: "TGPL",
    formResetBehavior: "reset",
    defaultValue: "",
    choices: {
      "1": "None",
      "2": "Ground",
      "3": "Human Player",
      "4": "Both"
    }
  },
  {
    title: "Coral L1 Scored",
    description: "The number of level 1 coral scored during autonomous.",
    type: "counter",
    required: false,
    code: "CLOT",
    formResetBehavior: "reset",
    defaultValue: 0,
    min: 0,
    step: 1
  },
  {
    title: "Coral L2 Scored",
    description: "The number of level 2 coral scored during autonomous.",
    type: "counter",
    required: false,
    code: "CLTT",
    formResetBehavior: "reset",
    defaultValue: 0,
    min: 0,
    step: 1
  },
  {
    title: "Coral L3 Scored",
    description: "The number of level 3 coral scored during autonomous.",
    type: "counter",
    required: false,
    code: "CLThT",
    formResetBehavior: "reset",
    defaultValue: 0,
    min: 0,
    step: 1
  },
  {
    title: "Coral L4 Scored",
    description: "The number of level 4 coral scored during autonomous.",
    type: "counter",
    required: false,
    code: "CLFT",
    formResetBehavior: "reset",
    defaultValue: 0,
    min: 0,
    step: 1
  },
  {
    title: "Barge Algae Scored",
    description: "The number of Algae scored in the barge during autonomous.",
    type: "counter",
    required: false,
    code: "BAST",
    formResetBehavior: "reset",
    defaultValue: 0,
    min: 0,
    step: 1
  },
  {
    title: "Processor Algae Scored",
    description: "The number of Algae scored in the processor during autonomous.",
    type: "counter",
    required: false,
    code: "PAST",
    formResetBehavior: "reset",
    defaultValue: 0,
    min: 0,
    step: 1
  },
  {
    title: "Crossed Field/Played Defense?",
    type: "boolean",
    required: false,
    code: "CFPDT",
    formResetBehavior: "reset",
    defaultValue: false
  },
  {
    title: "Was Robot Defended by Other Alliance?",
    type: "boolean",
    required: false,
    code: "DEFEg",
    formResetBehavior: "reset",
    defaultValue: false
  },
  {
    title: "Touched Opposing Cage?",
    type: "counter",
    required: false,
    code: "Fou/Tech",
    formResetBehavior: "reset",
    defaultValue: 0,
    step: 1
  }
];

const endgameFields: ScoutField[] = [
  {
    title: "End Position",
    type: "select",
    required: true,
    code: "epo",
    formResetBehavior: "reset",
    defaultValue: "No",
    choices: {
      "No": "Not Parked",
      "P": "Parked",
      "Sc": "High Hang",
      "Dc": "Low Hang",
      "Fc": "Failed Hang"
    }
  },
  {
    title: "Died?",
    type: "boolean",
    required: false,
    code: "DEg",
    formResetBehavior: "reset",
    defaultValue: false
  },
  {
    title: "Tipped/Fell Over?",
    type: "boolean",
    required: false,
    code: "TFOT",
    formResetBehavior: "reset",
    defaultValue: false
  }
];

const postmatchFields: ScoutField[] = [
  {
    title: "Offense Skill",
    type: "range",
    required: false,
    code: "or",
    formResetBehavior: "reset",
    defaultValue: 3,
    min: 1,
    max: 5,
    step: 1
  },
  {
    title: "Defensive Skill",
    type: "range",
    required: false,
    code: "dr",
    formResetBehavior: "reset",
    defaultValue: 0,
    min: 0,
    max: 5,
    step: 1
  },
  {
    title: "Yellow/Red Card",
    type: "select",
    required: true,
    code: "yc",
    formResetBehavior: "reset",
    defaultValue: "No Card",
    choices: {
      "No Card": "No Card",
      "Yellow": "Yellow Card",
      "Red": "Red Card"
    }
  }
];

const rankingPointsFields: ScoutField[] = [
  {
    title: "Autonomous",
    description: "1 point for autonomous",
    type: "boolean",
    required: false,
    code: "autoRP",
    formResetBehavior: "reset",
    defaultValue: false
  },
  {
    title: "Coral",
    description: "1 point for coral",
    type: "boolean",
    required: false,
    code: "coralRP",
    formResetBehavior: "reset",
    defaultValue: false
  },
  {
    title: "Barge",
    description: "1 point for barge",
    type: "boolean",
    required: false,
    code: "bargeRP",
    formResetBehavior: "reset",
    defaultValue: false
  },
  {
    title: "Win",
    description: "3 points for win",
    type: "boolean",
    required: false,
    code: "winRP",
    formResetBehavior: "reset",
    defaultValue: false
  },
  {
    title: "Tie",
    description: "1 point for tie",
    type: "boolean",
    required: false,
    code: "tieRP",
    formResetBehavior: "reset",
    defaultValue: false
  }
];

function App() {
  const { isDark, toggleTheme } = useTheme();
  const [formData, setFormData] = useState(() => {
    return [...prematchFields, ...autonomousFields, ...teleopFields, ...endgameFields, ...postmatchFields, ...rankingPointsFields].reduce((acc, field) => {
      acc[field.code] = field.defaultValue;
      return acc;
    }, {} as Record<string, any>);
  });

  const [timers, setTimers] = useState<Record<string, { isRunning: boolean; startTime: number; elapsed: number }>>({});
  const [showQRCode, setShowQRCode] = useState(false);

  const totalRankingPoints = useMemo(() => {
    let total = 0;
    if (formData.autoRP) total += 1;
    if (formData.coralRP) total += 1;
    if (formData.bargeRP) total += 1;
    if (formData.winRP) total += 3;
    if (formData.tieRP) total += 1;
    return total;
  }, [formData.autoRP, formData.coralRP, formData.bargeRP, formData.winRP, formData.tieRP]);

  const handleInputChange = (code: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [code]: value
    }));
  };

  const handleCounter = (code: string, increment: boolean) => {
    setFormData(prev => {
      const field = [...autonomousFields, ...teleopFields, ...endgameFields].find(f => f.code === code);
      if (!field) return prev;
      
      const currentValue = prev[code] || 0;
      const step = field.step || 1;
      const newValue = increment ? currentValue + step : Math.max(0, currentValue - step);
      
      return {
        ...prev,
        [code]: newValue
      };
    });
  };

  const toggleTimer = (code: string) => {
    setTimers(prev => {
      const timer = prev[code] || { isRunning: false, startTime: 0, elapsed: 0 };
      
      if (timer.isRunning) {
        return {
          ...prev,
          [code]: {
            ...timer,
            isRunning: false,
            elapsed: timer.elapsed + (Date.now() - timer.startTime)
          }
        };
      } else {
        return {
          ...prev,
          [code]: {
            ...timer,
            isRunning: true,
            startTime: Date.now()
          }
        };
      }
    });
  };

  const handleCommit = () => {
    setShowQRCode(true);
  };

  const getFormDataString = () => {
    const data = {
      ...formData,
      timers: Object.entries(timers).reduce((acc, [code, timer]) => {
        acc[code] = timer.elapsed;
        return acc;
      }, {} as Record<string, number>),
      totalRankingPoints
    };
    return JSON.stringify(data);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => {
        const newTimers = { ...prev };
        let updated = false;
        
        Object.entries(newTimers).forEach(([code, timer]) => {
          if (timer.isRunning) {
            newTimers[code] = {
              ...timer,
              elapsed: timer.elapsed + (Date.now() - timer.startTime),
              startTime: Date.now()
            };
            updated = true;
          }
        });
        
        return updated ? newTimers : prev;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const renderField = (field: ScoutField) => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={formData[field.code]}
            onChange={(e) => handleInputChange(field.code, e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={field.required}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={formData[field.code]}
            onChange={(e) => handleInputChange(field.code, Number(e.target.value))}
            min={field.min}
            max={field.max}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={field.required}
          />
        );
      case 'select':
        return (
          <select
            value={formData[field.code]}
            onChange={(e) => handleInputChange(field.code, e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={field.required}
          >
            <option value="">Select...</option>
            {field.choices && Object.entries(field.choices).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        );
      case 'boolean':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData[field.code]}
              onChange={(e) => handleInputChange(field.code, e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-600">{field.title}</span>
          </div>
        );
      case 'counter':
        return (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleCounter(field.code, false)}
              className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              -
            </button>
            <span className="w-12 text-center">{formData[field.code]}</span>
            <button
              onClick={() => handleCounter(field.code, true)}
              className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              +
            </button>
          </div>
        );
      case 'timer':
        const timer = timers[field.code] || { isRunning: false, elapsed: 0 };
        const totalElapsed = timer.isRunning 
          ? timer.elapsed + (Date.now() - timer.startTime)
          : timer.elapsed;
        const seconds = Math.floor(totalElapsed / 1000);
        const milliseconds = Math.floor((totalElapsed % 1000) / 10);
        
        return (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleTimer(field.code)}
              className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                timer.isRunning ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
              }`}
            >
              {timer.isRunning ? 'Stop' : 'Start'}
            </button>
            <span className="font-mono text-lg">
              {`${seconds}.${milliseconds.toString().padStart(2, '0')}`}
            </span>
          </div>
        );
      case 'range':
        return (
          <div className="space-y-2">
            <input
              type="range"
              value={formData[field.code]}
              onChange={(e) => handleInputChange(field.code, Number(e.target.value))}
              min={field.min}
              max={field.max}
              step={field.step}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{field.min}</span>
              <span>{formData[field.code]}</span>
              <span>{field.max}</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-dark-900' : 'bg-gray-100'} transition-colors duration-200`}>
      <div className={`${isDark ? 'bg-dark-800 border-dark-700' : 'bg-white border-gray-200'} border-b transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Laptop2 className={`h-8 w-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <div>
                <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{scoutConfig.title}</h1>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Team {scoutConfig.teamNumber} - {scoutConfig.page_title}</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${
                isDark 
                  ? 'bg-dark-700 hover:bg-dark-600 text-gray-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              } transition-colors duration-200`}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {[
          { title: 'Prematch', fields: prematchFields },
          { title: 'Autonomous', fields: autonomousFields },
          { title: 'Teleop', fields: teleopFields },
          { title: 'Endgame', fields: endgameFields },
          { title: 'Postmatch', fields: postmatchFields }
        ].map(section => (
          <div key={section.title} className={`${isDark ? 'bg-dark-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-8 transition-colors duration-200`}>
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.fields.map((field) => (
                <div key={field.code} className="space-y-2">
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {field.title}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <div className="relative">
                    {renderField(field)}
                  </div>
                  {field.description && (
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{field.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className={`${isDark ? 'bg-dark-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-8 transition-colors duration-200`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Ranking Points</h2>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Total:</span>
              <span className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{totalRankingPoints}</span>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>/ 6</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rankingPointsFields.map((field) => (
              <div key={field.code} className="space-y-2">
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {field.title}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="relative">
                  {renderField(field)}
                </div>
                {field.description && (
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{field.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`${isDark ? 'bg-dark-800' : 'bg-white'} rounded-lg shadow p-6 transition-colors duration-200`}>
            <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Notes</h3>
            <textarea
              className={`w-full h-32 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDark 
                  ? 'bg-dark-700 border-dark-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Add your notes here..."
            />
          </div>
        </div>
      </div>

      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${isDark ? 'bg-dark-800' : 'bg-white'} p-8 rounded-lg shadow-xl max-w-md w-full`}>
            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Scan QR Code</h3>
            <div className="flex justify-center mb-4">
              <QRCodeSVG
                value={getFormDataString()}
                size={256}
                level="H"
                includeMargin={true}
                bgColor={isDark ? '#1e293b' : '#ffffff'}
                fgColor={isDark ? '#ffffff' : '#000000'}
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowQRCode(false)}
                className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isDark 
                    ? 'bg-dark-700 text-gray-300 hover:bg-dark-600 focus:ring-dark-500' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-8 right-8">
        <button
          onClick={handleCommit}
          className={`px-6 py-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isDark 
              ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400' 
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
          }`}
        >
          Commit Data
        </button>
      </div>
    </div>
  );
}

export default App;

export default App