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

  const sizes = [
    { value: 'sm', label: 'Small (16px)', pixels: 16 },
    { value: 'md', label: 'Medium (20px)', pixels: 20 },
    { value: 'lg', label: 'Large (24px)', pixels: 24 },
  ] as const;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-display bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
          Icons Preview - Lineal Color Style
        </h1>
        <p className="text-body">
          Flaticon-inspired icons with colorful accents
        </p>
      </div>

      {/* All Icons Grid */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Icons (Default Size: md - 20px)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-6">
            {icons.map((icon) => (
              <div
                key={icon.name}
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Icon name={icon.name} size="md" />
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
          <CardTitle>Standardized Size Scale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sizes.map((size) => (
              <div key={size.value} className="space-y-2">
                <h3 className="text-caption font-semibold text-muted-foreground">
                  {size.label}
                </h3>
                <div className="flex flex-wrap items-center gap-6">
                  {icons.map((icon) => (
                    <div
                      key={`${icon.name}-${size.value}`}
                      className="flex flex-col items-center gap-1"
                    >
                      <Icon name={icon.name} size={size.value as 'sm' | 'md' | 'lg'} />
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
            <h3 className="text-caption font-semibold">In Buttons:</h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-pink-500 text-white rounded-lg flex items-center gap-2 hover:bg-pink-600 transition-colors">
                <Icon name="home" size="md" />
                Home
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors">
                <Icon name="income" size="md" />
                Income
              </button>
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg flex items-center gap-2 hover:bg-purple-600 transition-colors">
                <Icon name="budget" size="md" />
                Budget
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-caption font-semibold">In Cards:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Icon name="income" size="lg" />
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
                  <Icon name="expenses" size="lg" />
                  <CardTitle className="text-lg">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-expense">
                    Rp 7,500,000
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Icon name="budget" size="lg" />
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
            <h3 className="text-caption font-semibold">In Text:</h3>
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-lg">
                <Icon name="heart" size="lg" />
                <span className="font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                  Personal Finance Manager
                </span>
              </p>
              <p className="text-body flex items-center gap-2">
                <Icon name="sparkles" size="sm" />
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
            <h3 className="text-caption font-semibold">Basic Usage:</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
              <code>{`<Icon name="home" size="md" /> // 20px
<Icon name="home" size="sm" /> // 16px
<Icon name="home" size="lg" /> // 24px`}</code>
            </pre>
          </div>

          <div className="space-y-2">
            <h3 className="text-caption font-semibold">With Custom Classes:</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
              <code>{`<Icon 
  name="income" 
  size="lg" 
  className="text-green-500 hover:scale-110 transition-transform"
/>`}</code>
            </pre>
          </div>

          <div className="space-y-2">
            <h3 className="text-caption font-semibold">In Components:</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
              <code>{`<button className="flex items-center gap-2">
  <Icon name="budget" size="md" />
  <span>View Budget</span>
</button>`}</code>
            </pre>
          </div>

          <div className="space-y-2">
            <h3 className="text-caption font-semibold">Size Guidelines:</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
              <code>{`sm (16px): Action buttons, inline icons, summary cards
md (20px): Default size, navigation, section icons
lg (24px): Section headers, prominent UI elements`}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
