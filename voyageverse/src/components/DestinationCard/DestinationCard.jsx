export default function DestinationCard({ destination, imgUrl }) {
  return (
    <div className="relative w-full h-[220px] overflow-hidden rounded-xl shadow-lg group cursor-pointer">
      <img
        src={imgUrl}
        alt={destination}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      {/* Destination name */}
      <h3
        className="absolute bottom-3 left-4 text-white font-semibold text-base drop-shadow-lg tracking-wide capitalize"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {destination}
      </h3>
    </div>
  )
}
