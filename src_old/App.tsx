import React from 'react';
import { ArrowLeft, ArrowRight, Settings2, Filter, ArrowUpRight, Bell, Sun, 
  Zap, Building2, CircleDollarSign, CreditCard, BookOpen, Settings, Award, HelpCircle, Bot, Search } from 'lucide-react';

function App() {
  return (
    <div className="flex min-h-screen bg-[#1a1d24] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a1d24] border-r border-gray-800">
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          
          <nav className="space-y-1">
            <a href="#" className="flex items-center space-x-3 px-3 py-3 text-white bg-gray-800 rounded-lg">
              <Zap className="w-5 h-5" />
              <span className="font-medium">Insights</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-3 text-gray-400 hover:bg-gray-800 rounded-lg">
              <Building2 className="w-5 h-5" />
              <span>Company</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-3 text-gray-400 hover:bg-gray-800 rounded-lg">
              <CircleDollarSign className="w-5 h-5" />
              <span>Transactions</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-3 text-gray-400 hover:bg-gray-800 rounded-lg">
              <CreditCard className="w-5 h-5" />
              <span>Cards</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-3 text-gray-400 hover:bg-gray-800 rounded-lg">
              <BookOpen className="w-5 h-5" />
              <span>Accounting</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-3 text-gray-400 hover:bg-gray-800 rounded-lg">
              <Bot className="w-5 h-5" />
              <span>AI Agent</span>
            </a>
          </nav>

          <div className="absolute bottom-8 left-0 w-64 px-4">
            <nav className="space-y-1">
              <a href="#" className="flex items-center space-x-3 px-3 py-3 text-gray-400 hover:bg-gray-800 rounded-lg">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-3 text-gray-400 hover:bg-gray-800 rounded-lg">
                <Award className="w-5 h-5" />
                <span>Partner rewards</span>
              </a>
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Navigation */}
        <nav className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative flex items-center">
              <div className="absolute left-3 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="search"
                placeholder="Search anything..."
                className="bg-[#1e2128] rounded-lg pl-10 pr-16 py-2 w-[280px] text-[15px] text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-700"
              />
              <div className="absolute right-3 px-1.5 py-0.5 rounded bg-[#2b2f38] text-[13px] text-gray-400">
                ⌘K
              </div>
            </div>
            <button className="p-2 hover:bg-gray-800 rounded-lg">
              <HelpCircle className="w-5 h-5 text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-lg">
              <Bell className="w-5 h-5 text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-lg">
              <Sun className="w-5 h-5 text-gray-400" />
            </button>
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces"
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </nav>

        {/* Main Content */}
        <div className="p-6">
          {/* Header Controls */}
          <div className="flex justify-between mb-6">
            <div className="flex space-x-2">
              <button className="p-2 rounded hover:bg-gray-800">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button className="p-2 rounded hover:bg-gray-800">
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-gray-800">
                <Settings2 className="w-4 h-4" />
                <span>Configure</span>
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-400">Sales today</span>
                <span className="text-green-400 bg-green-400/10 px-2 rounded">+21%</span>
              </div>
              <div className="text-2xl font-semibold">$1,036<span className="text-sm">.62</span></div>
              <div className="mt-4 text-sm text-gray-400">
                ✨ Forecast with Genius
              </div>
              <div className="flex gap-2 mt-2">
                <button className="bg-gray-700 px-3 py-1 rounded text-sm">7d</button>
                <button className="bg-gray-700 px-3 py-1 rounded text-sm">30d</button>
                <button className="bg-gray-700 px-3 py-1 rounded text-sm">90d</button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-400">Avg customer spend</span>
                <span className="text-red-400 bg-red-400/10 px-2 rounded">-0.7%</span>
              </div>
              <div className="text-2xl font-semibold">$244<span className="text-sm">.82</span></div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-gray-400 mb-4">Your potential savings</div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">💰</div>
                <div className="text-xl font-semibold">$1,870<span className="text-sm">.00</span></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-400/20 rounded-full flex items-center justify-center">🌱</div>
                <div className="text-xl font-semibold">$598<span className="text-sm">.00</span></div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400">Increase in monthly spend</span>
                <ArrowUpRight className="text-yellow-400" />
              </div>
              <div className="text-2xl font-semibold">72%</div>
              <p className="text-sm text-gray-400 mt-2">Your spending on SaaS/Software has gone up significantly in the last 30 days.</p>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <select className="bg-gray-700 rounded px-3 py-2">
                  <option>Last 4 weeks</option>
                </select>
                <div className="bg-gray-700 rounded px-3 py-2">Jun 8 - Jul 5</div>
                <span className="text-gray-400">compared to</span>
                <select className="bg-gray-700 rounded px-3 py-2">
                  <option>Previous period</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <button className="bg-gray-700 px-4 py-2 rounded">Daily</button>
                <button className="bg-gray-700 px-4 py-2 rounded">Weekly</button>
                <button className="bg-blue-500 px-4 py-2 rounded flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <div className="text-gray-400">Income</div>
                <div className="text-2xl font-semibold">$23,242<span className="text-sm">.37</span></div>
              </div>
              <div>
                <div className="text-gray-400">Expenses</div>
                <div className="text-2xl font-semibold">$4,597<span className="text-sm">.55</span></div>
              </div>
            </div>

            <div className="h-64 w-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;