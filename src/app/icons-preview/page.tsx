// File: src/app/icons-preview/page.tsx
// Preview page for all icons (development only)
"use client";

import { Icon } from "@/components/icons/Icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function IconsPreviewPage() {
  const icons = [
    { name: "home", label: "Home", color: "text-pink-500" },
    { name: "income", label: "Income", color: "text-green-500" },
    { name: "expenses", label: "Expenses", color: "text-rose-500" },
    { name: "budget", label: "Budget", color: "text-purple-500" },
    { name: "rates", label: "Rates", color: "text-blue-500" },
    { name: "simulation", label: "Simulation", color: "text-cyan-500" },
    { name: "heart", label: "Heart", color: "text-pink-500" },
    { name: "sparkles", label: "Sparkles", color: "text-yellow-500" },
  ];

  const sizes = [16, 24, 32, 48, 64];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
          Icons Preview - Lineal Color Style
        </h1>
        <p className="text-muted-foreground">
          Flaticon-inspired icons with colorful accents
        </p>
      </div>

      {/* All Icons Grid */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Icons (Default Size: 24px)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-6">
            {icons.map((icon) => (
              <div
                key={icon.name}
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Icon name={icon.name} size={24} />
                <span className="text-xs font-medium text-center">
                  {icon.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Size Variations */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Size Variations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sizes.map((size) => (
              <div key={size} className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Size: {size}px
                </h3>
                <div className="flex flex-wrap items-center gap-6">
                  {icons.map((icon) => (
                    <div
                      key={`${icon.name}-${size}`}
                      className="flex flex-col items-center gap-1"
                    >
                      <Icon name={icon.name} size={size} />
                      <span className="text-xs text-muted-foreground">
                        {icon.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Color Variations */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>With Custom Colors (className)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-6">
            {icons.map((icon) => (
              <div
                key={`colored-${icon.name}`}
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Icon
                  name={icon.name}
                  size={32}
                  className={`${icon.color} hover:scale-110 transition-transform`}
                />
                <span className="text-xs font-medium text-center">
                  {icon.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">In Buttons:</h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-pink-500 text-white rounded-lg flex items-center gap-2 hover:bg-pink-600 transition-colors">
                <Icon name="home" size={20} />
                Home
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors">
                <Icon name="income" size={20} />
                Income
              </button>
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg flex items-center gap-2 hover:bg-purple-600 transition-colors">
                <Icon name="budget" size={20} />
                Budget
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">In Cards:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Icon name="income" size={24} />
                  <CardTitle className="text-lg">Total Income</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">
                    Rp 10,000,000
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Icon name="expenses" size={24} />
                  <CardTitle className="text-lg">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-rose-600">
                    Rp 7,500,000
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Icon name="budget" size={24} />
                  <CardTitle className="text-lg">Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-purple-600">
                    Rp 2,500,000
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">In Text:</h3>
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-lg">
                <Icon name="heart" size={24} />
                <span className="font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                  Personal Finance Manager
                </span>
              </p>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="sparkles" size={16} />
                Track your income and expenses with style
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Examples */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Code Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Basic Usage:</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
              <code>{`<Icon name="home" size={24} />`}</code>
            </pre>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">With Custom Classes:</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
              <code>{`<Icon 
  name="income" 
  size={32} 
  className="text-green-500 hover:scale-110 transition-transform"
/>`}</code>
            </pre>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">In Components:</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
              <code>{`<button className="flex items-center gap-2">
  <Icon name="budget" size={20} />
  <span>View Budget</span>
</button>`}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
