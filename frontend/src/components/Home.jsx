import { useNavigate } from 'react-router-dom';

const destinations = [
  { id: 1, name: "Paris, France", description: "The City of Light", price: "$1,299",img:"https://th.bing.com/th/id/OIP.334mkUz6Fu9loQEj5TF-KgHaE8?rs=1&pid=ImgDetMain"},
  { id: 2, name: "Tokyo, Japan", description: "Where tradition meets future", price: "$1,899",img:"https://th.bing.com/th/id/OIP.AA1Rn-hZK6amGERL_560XAHaE7?rs=1&pid=ImgDetMain" },
  { id: 3, name: "Bali, Indonesia", description: "Island of the Gods", price: "$1,499",img:"https://th.bing.com/th/id/OIP.t5RpD7m7ry6qpyT6IB8EgAHaE8?rs=1&pid=ImgDetMain" },
];

export default function HomePage() {
  // Hero image (single image)
  const heroImage = "https://www.pixelstalk.net/wp-content/uploads/images1/Beautiful-New-York-City-Light-at-Night-Wallpaper-in-High-Resolution.jpg";
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", color: "#333", margin: 0, padding: 0 }}>
      <header style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}>
        {/* Single Hero Image */}
        <img
          src={heroImage}
          alt="Hero Image"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Hero Text Overlay */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
          textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          padding: "0 1rem",
          background: "rgba(5, 5, 5, 0.3)", // Added slight overlay for better text visibility
        }}>
          <h1 style={{ fontSize: "3.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
            Discover Your Dream Destination
          </h1>
          <p style={{ fontSize: "1.25rem", marginBottom: "2rem", lineHeight: 1.6 }}>
            Unforgettable experiences, personalized itineraries, and premium accommodations for the discerning traveler.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button style={{
              backgroundColor: "#2563eb",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: 600,
              transition: "all 0.3s ease"
            }} onClick={() => navigate('/signup')}>
              Browse Destinations
            </button>
          </div>
        </div>
      </header>

      {/* Featured Destinations */}
      <section style={{ padding: "5rem 2rem", backgroundColor: "#f8fafc" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: "700", color: "#1e3a8a", marginBottom: "1rem" }}>
              Featured Destinations
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#64748b", maxWidth: "700px", margin: "0 auto", lineHeight: 1.6 }}>
              Handpicked destinations that offer unforgettable experiences, cultural immersion, and breathtaking views.
            </p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
            {destinations.map((destination) => (
              <div
                key={destination.id}
                style={{
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                  borderRadius: "0.75rem",
                  backgroundColor: "white",
                  transition: "transform 0.3s ease",
                  cursor: "pointer",
                }}
              >
                <div style={{ height: "220px", overflow: "hidden" }}>
                  <img
                    src={destination.img}
                    alt={destination.name}
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "cover",
                      transition: "transform 0.5s ease" 
                    }}
                  />
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "600", margin: 0 }}>{destination.name}</h3>
                    <span style={{ 
                      backgroundColor: "#e0f2fe", 
                      color: "#0369a1",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "1rem",
                      fontSize: "0.875rem",
                      fontWeight: "500"
                    }}>
                      {destination.price}
                    </span>
                  </div>
                  <p style={{ color: "#64748b", marginTop: "0.5rem", fontSize: "0.95rem" }}>
                    {destination.description}
                  </p>
                  <div style={{ marginTop: "1.5rem" }}>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <button style={{
              backgroundColor: "transparent",
              color: "#2563eb",
              padding: "0.75rem 2rem",
              borderRadius: "0.5rem",
              border: "2px solid #2563eb",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "600",
              transition: "all 0.3s ease"
            }}
            onClick={() => navigate('/login')}>
              View All Destinations
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: "5rem 2rem", backgroundColor: "white" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: "700", color: "#1e3a8a", marginBottom: "1rem" }}>
              Why Choose Us
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#64748b", maxWidth: "700px", margin: "0 auto", lineHeight: 1.6 }}>
              We create memorable journeys tailored to your preferences and needs.
            </p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
            {[
              { title: "Expert Guidance", icon: "🌟", desc: "Travel specialists with extensive destination knowledge" },
              { title: "Personalized Trips", icon: "🧩", desc: "Customized itineraries based on your preferences" },
              { title: "Fully accessible", icon: "📱", desc: "24/7 assistance throughout your journey" },
            ].map((item, index) => (
              <div key={index} style={{ 
                padding: "2rem", 
                backgroundColor: "#f8fafc", 
                borderRadius: "0.75rem",
                textAlign: "center" 
              }}>
                <div style={{ 
                  fontSize: "2.5rem", 
                  marginBottom: "1rem",
                  background: "#e0f2fe",
                  width: "70px",
                  height: "70px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  margin: "0 auto 1.5rem"
                }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.75rem" }}>{item.title}</h3>
                <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer style={{ 
        backgroundColor: "#0f172a", 
        color: "white",
        padding: "4rem 2rem 2rem" 
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ 
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            paddingBottom: "2rem",
            marginBottom: "2rem"
          }}>
            <div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1.5rem", color: "#3b82f6" }}>
                TravelEase
              </h3>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.6, opacity: 0.8, maxWidth: "300px" }}>
                Making travel accessible, enjoyable, and memorable for everyone since 2010.
              </p>
            </div>
            
            {[
              { title: "Company", links: ["About Us", "Careers", "Blog", "Press"] },
              { title: "Support", links: ["Contact Us", "FAQs", "Privacy Policy", "Terms of Service"] },
              { title: "Explore", links: ["Destinations", "Tours", "Special Offers", "Gift Cards"] }
            ].map((column, index) => (
              <div key={index}>
                <h4 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1rem" }}>{column.title}</h4>
                <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
                  {column.links.map((link, i) => (
                    <li key={i} style={{ marginBottom: "0.75rem" }}>
                      <a href="#" style={{ 
                        color: "rgba(255,255,255,0.7)", 
                        textDecoration: "none",
                        fontSize: "0.95rem",
                        transition: "color 0.2s ease"
                      }}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            fontSize: "0.9rem",
            color: "rgba(255,255,255,0.6)"
          }}>
            <div>© 2025 TravelEase. All rights reserved.</div>
            <div style={{ display: "flex", gap: "1rem" }}>
              {["Facebook", "Twitter", "Instagram", "LinkedIn"].map((social, i) => (
                <a key={i} href="#" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}