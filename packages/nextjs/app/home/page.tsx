"use client ";

import React from "react";
import Image from "next/image";
import logo from "../../public/logo.svg";
import type { NextPage } from "next";

const Dashboard: NextPage = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 p-4 flex flex-col" style={{ backgroundColor: "#23383E" }}>
        <div className="mb-16">
          <Image src={logo} alt="Logo" />
        </div>
        <nav className="flex-grow">
          <ul>
            <li className="mb-12 pb-4 pt-4 border-b-2 border-white w-3/4 mx-auto">
              <a href="#" className="text-lg font-bold">
                Marketplace
              </a>
            </li>
            <li className="mb-12 pb-4 pt-4 border-b-2 border-white w-3/4 mx-auto">
              <a href="#" className="text-lg font-bold">
                Earn $BACK
              </a>
            </li>
            <li className="mb-12 pb-4 pt-4 border-b-2 border-white w-3/4 mx-auto">
              <a href="#" className="text-lg font-bold">
                Settings
              </a>
            </li>
          </ul>
        </nav>
        <div className="mt-auto">
          <div className="mb-4">
            <a href="#" className="text-sm">
              Having any Issues? Reach out to us
            </a>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-xl">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-xl">
              <i className="fab fa-telegram"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-8" style={{ backgroundColor: "#1A2B2E" }}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Earn $BACK By Completing Tasks</h1>
          <button className="bg-blue-600 px-4 py-2 rounded-lg">Connect Wallet</button>
        </div>

        {/* Task List */}
        <table className="w-full bg-gray-800 rounded-lg">
          <thead>
            <tr className="text-left">
              <th className="p-4">Task</th>
              <th className="p-4">App</th>
              <th className="p-4">Owners</th>
              <th className="p-4">Price</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-700">
              <td className="p-4">Buy tokens</td>
              <td className="p-4 flex items-center">
                <img src="/path/to/app1.png" alt="App" className="inline h-6 mr-2" />{" "}
              </td>
              <td>fabbais.eth</td>
              <td className="p-4">50$</td>
              <td className="p-4">
                <button className="bg-purple-600 px-4 py-2 rounded-lg">Earn</button>
              </td>
            </tr>
            <tr className="border-t border-gray-700">
              <td className="p-4">Place limit order</td>
              <td className="p-4 flex items-center">
                <img src="/path/to/app2.png" alt="App" className="inline h-6 mr-2" />{" "}
              </td>
              <td>vitalik.eth</td>
              <td className="p-4">40$</td>
              <td className="p-4">
                <button className="bg-purple-600 px-4 py-2 rounded-lg">Earn</button>
              </td>
            </tr>
            <tr className="border-t border-gray-700">
              <td className="p-4">Provide liquidity to LP pool</td>
              <td className="p-4 flex items-center">
                <img src="/path/to/app3.png" alt="App" className="inline h-6 mr-2" />{" "}
              </td>
              <td>alex.eth</td>
              <td className="p-4">35$</td>
              <td className="p-4">
                <button className="bg-purple-600 px-4 py-2 rounded-lg">Earn</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
