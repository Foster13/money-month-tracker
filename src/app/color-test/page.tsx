'use client';

import React from 'react';

export default function ColorTestPage() {
  return (
    <div className="container-spacing py-8">
      <h1 className="text-heading-lg mb-8">Semantic Color Classes Test</h1>
      
      <div className="stack-spacing-lg">
        {/* Income Colors */}
        <section className="card-base card-padding">
          <h2 className="text-heading mb-4">Income Colors (Green)</h2>
          <div className="stack-spacing">
            <div className="flex items-center gap-4">
              <span className="text-income text-financial">$1,234.56</span>
              <span className="text-caption">(.text-income)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-income border-income border px-4 py-2 rounded">
                Income Background
              </div>
              <span className="text-caption">(.bg-income .border-income)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="border-income border-2 px-4 py-2 rounded">
                Income Border Only
              </div>
              <span className="text-caption">(.border-income)</span>
            </div>
          </div>
        </section>

        {/* Expense Colors */}
        <section className="card-base card-padding">
          <h2 className="text-heading mb-4">Expense Colors (Red)</h2>
          <div className="stack-spacing">
            <div className="flex items-center gap-4">
              <span className="text-expense text-financial">$987.65</span>
              <span className="text-caption">(.text-expense)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-expense border-expense border px-4 py-2 rounded">
                Expense Background
              </div>
              <span className="text-caption">(.bg-expense .border-expense)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="border-expense border-2 px-4 py-2 rounded">
                Expense Border Only
              </div>
              <span className="text-caption">(.border-expense)</span>
            </div>
          </div>
        </section>

        {/* Budget Colors */}
        <section className="card-base card-padding">
          <h2 className="text-heading mb-4">Budget Colors (Purple)</h2>
          <div className="stack-spacing">
            <div className="flex items-center gap-4">
              <span className="text-budget text-financial">$5,000.00</span>
              <span className="text-caption">(.text-budget)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-budget border-budget border px-4 py-2 rounded">
                Budget Background
              </div>
              <span className="text-caption">(.bg-budget .border-budget)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="border-budget border-2 px-4 py-2 rounded">
                Budget Border Only
              </div>
              <span className="text-caption">(.border-budget)</span>
            </div>
          </div>
        </section>

        {/* Combined Example */}
        <section className="card-base card-padding">
          <h2 className="text-heading mb-4">Combined Example</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-income border-income border rounded-lg p-4">
              <div className="text-caption mb-2">Total Income</div>
              <div className="text-income text-financial-lg">$12,345.67</div>
            </div>
            <div className="bg-expense border-expense border rounded-lg p-4">
              <div className="text-caption mb-2">Total Expenses</div>
              <div className="text-expense text-financial-lg">$8,765.43</div>
            </div>
            <div className="bg-budget border-budget border rounded-lg p-4">
              <div className="text-caption mb-2">Budget Remaining</div>
              <div className="text-budget text-financial-lg">$3,580.24</div>
            </div>
          </div>
        </section>

        {/* Dark Mode Instructions */}
        <section className="card-base card-padding bg-muted">
          <h2 className="text-heading mb-4">Testing Instructions</h2>
          <div className="stack-spacing-sm text-body">
            <p>✅ All semantic color classes are defined in globals.css</p>
            <p>✅ Classes include: .text-income, .text-expense, .text-budget</p>
            <p>✅ Classes include: .bg-income, .bg-expense, .bg-budget</p>
            <p>✅ Classes include: .border-income, .border-expense, .border-budget</p>
            <p className="mt-4 font-semibold">To test dark mode:</p>
            <p>Toggle the theme switcher in the navigation bar and verify that:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Income colors remain green (lighter shade in dark mode)</li>
              <li>Expense colors remain red (lighter shade in dark mode)</li>
              <li>Budget colors remain purple (lighter shade in dark mode)</li>
              <li>All backgrounds and borders adapt appropriately</li>
              <li>Text contrast remains readable in both modes</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
