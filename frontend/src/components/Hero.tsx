interface HeroProps {
  onBookNow: () => void;
}

export default function Hero({ onBookNow }: HeroProps) {
  return (
    <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-10"></div>

      <div className="relative text-center px-4 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-light tracking-tight text-gray-900 mb-6">
          Your Beauty Journey Starts Here
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 font-light">
          Professional beauty services with experienced masters in a minimalist, relaxing atmosphere
        </p>
        <button
          onClick={onBookNow}
          className="bg-gray-900 text-white px-8 py-3 text-sm font-light tracking-wide hover:bg-gray-800 transition-colors"
        >
          Book an Appointment
        </button>
      </div>
    </section>
  );
}
