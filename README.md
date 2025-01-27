# Dokumentasi Teknis Bot Trading

## Daftar Isi
1. [Struktur Aplikasi](#struktur-aplikasi)
2. [Komponen](#komponen)
3. [Services](#services)
4. [State Management](#state-management)

## Struktur Aplikasi

Aplikasi ini adalah bot trading yang dibangun menggunakan Next.js dengan Redux untuk state management. Aplikasi terdiri dari beberapa komponen utama yang menangani fungsionalitas berbeda.

### Tech Stack
- Next.js
- Redux Toolkit
- Tailwind CSS
- Axios untuk HTTP requests

## Komponen

### 1. Account Component (`Account.jsx`)
Komponen untuk menampilkan informasi akun dan kontrol bot.

**Props**: Tidak ada (menggunakan Redux)

**State yang digunakan**:
- `botRunning`: Status bot (aktif/tidak)
- `walletBalance`: Saldo wallet
- `availableBalance`: Saldo tersedia
- `marginBalance`: Saldo margin
- `category`, `symbol`, `interval`, `amount`: Filter trading

**Fungsi**:
- `handleBotRun()`: Mengontrol start/stop bot
- `handleRequestDemoFunds()`: Request demo funds
- `getBalance()`: Mengambil data saldo

### 2. Filter Component (`Filter.jsx`)
Komponen untuk mengatur parameter trading.

**State yang digunakan**:
- `category`: Kategori market (spot/linear)
- `symbol`: Pair trading
- `interval`: Interval chart
- `amount`: Jumlah trading

**Fungsi**:
- `handleCategoryChange()`: Update kategori
- `handleSymbolChange()`: Update symbol
- `handleIntervalChange()`: Update interval
- `handleAmountChange()`: Update amount

### 3. Position Component (`Position.jsx`)
Komponen untuk menampilkan posisi trading aktif.

**State yang digunakan**:
- `positions`: Array posisi aktif
- `category`, `symbol`: Filter
- `botRunning`: Status bot

**Data yang ditampilkan**:
- Symbol
- Side (Buy/Sell)
- Size
- Entry Price
- Mark Price
- Margin Type
- PnL
- Take Profit/Stop Loss

### 4. MarketData Component (`MarketData.jsx`)
Komponen untuk menampilkan data market.

**State yang digunakan**:
- `klineData`: Data candlestick
- Filter dari Redux (category, symbol, interval)

## Services

### 1. Account Service
```javascript
accountService.requestDemoFunds()
accountService.getAccountBalance(category)
```

### 2. Market Service
```javascript
marketService.getAllSymbol(category)
marketService.getAllKline({ category, symbol, interval })
```

### 3. Position Service
```javascript
positionService.getActivePositions(category, symbol)
```

### 4. Trade Service
```javascript
tradeService.placeOrder(category, symbol, side, quantity, takeProfit, stopLoss)
```

### 5. Bot Service
```javascript
botService.start(category, symbol, interval, amount)
botService.stop()
```

## State Management

### Filter Slice
```javascript
state.filter = {
  category: 'spot' | 'linear',
  symbol: string,
  amount: string,
  interval: string
}
```

### Account Slice
```javascript
state.account = {
  walletBalance: string,
  availableBalance: string,
  marginBalance: string,
  botRunning: boolean
}
```

## Panduan Penggunaan

### Setup Awal
1. Import komponen ProviderWrapper di root aplikasi
2. Pastikan semua dependencies terinstall
3. Setup environment variables untuk API keys

### Contoh Penggunaan Basic

```jsx
import { Account, Filter, Position, MarketData } from '@/components'

function TradingPage() {
  return (
    <div className="space-y-4">
      <Account />
      <Filter />
      <Position />
      <MarketData />
    </div>
  )
}
```

### Catatan Penting
1. Semua komponen menggunakan Tailwind CSS untuk styling
2. Real-time updates menggunakan interval 10 detik
3. Gunakan error handling untuk semua API calls
4. Perhatikan format data dari API (terutama untuk angka dan timestamp)