// Homepage component using Next.js and Tailwind CSS
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Medical Imaging Data for AI Innovation
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Accelerate healthcare AI development with curated datasets and seamless collaboration
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
              Get Started
            </button>
            <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {title: 'Curated Datasets', desc: 'Access millions of annotated medical images'},
              {title: 'Regulatory Support', desc: 'Streamlined compliance documentation'},
              {title: 'Collaborative Tools', desc: 'Secure data sharing and version control'},
            ].map((item, i) => (
              <div key={i} className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition">
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to Accelerate Your Medical AI?</h2>
          <p className="text-lg mb-8">Join leading research institutions and healthcare innovators</p>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-100 transition">
              Request Demo
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
