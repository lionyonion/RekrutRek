import MapPicker from '../../components/MapPicker';
export default function Dashboard() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-medium text-neutral-900 mb-1">Dashboard Korporasi</h1>
        <p className="text-sm text-neutral-500">Halaman ini sedang dikembangkan</p>
      </div>
      <div className="card text-center py-12">
        <p className="text-3xl mb-3">🚧</p>
        <p className="text-neutral-600 font-medium">Coming soon</p>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-md border border-neutral-200 mt-6 max-w-2xl">
        <MapPicker onLocationSelect={(lat, lng) => console.log("Koordinat terpilih:", lat, lng)} />
      </div>
    </div>
  )
}