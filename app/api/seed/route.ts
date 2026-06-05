import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Chef from "@/models/Chef";
import bcrypt from "bcryptjs";

const SEED_CHEFS = [
  { name:"Chef Elena Rossi", bio:"Former Michelin-star sous chef bringing modern Italian fine dining to your intimate gatherings.", cuisine:["Italian","Modern European"], moods:["Romantic","Celebration"], price:150, rating:4.9, reviews:124, availableNow:true, imageUrl:"https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80", acceptsSOS:true, offersTheater:true, offersLiveCam:false, signatureDish:{name:"Truffle Sphere Carbonara",description:"A modern take on the classic, featuring a liquid parmesan sphere.",imageUrl:"https://images.unsplash.com/photo-1626844131082-256783844137?w=800&q=80"}, lockedSignatureDish:{name:"The Golden Tiramisu",description:"24k gold leaf espresso caviar layered with mascarpone foam.",imageUrl:"https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800&q=80",bookingsRequired:3} },
  { name:"Chef Kenji Sato", bio:"Master of Omakase and fire-cooking, bringing the intensity of a Tokyo izakaya to your home.", cuisine:["Japanese","Fusion"], moods:["Adventure","Celebration"], price:200, rating:5.0, reviews:89, availableNow:false, imageUrl:"https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80", acceptsSOS:false, offersTheater:true, offersLiveCam:true, signatureDish:{name:"A5 Wagyu Smoke Box",description:"Cherry-wood smoked A5 Wagyu presented in a glass cloche.",imageUrl:"https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80"}, lockedSignatureDish:{name:"Deep Sea Uni Toast",description:"Hokkaido uni on charcoal brioche with truffle honey.",imageUrl:"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",bookingsRequired:3} },
  { name:"Chef Marcus Johnson", bio:"Elevating Southern comfort food with French techniques.", cuisine:["Southern","French"], moods:["Comfort","Romantic"], price:120, rating:4.8, reviews:210, availableNow:true, imageUrl:"https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800&q=80", acceptsSOS:true, offersTheater:false, offersLiveCam:false, signatureDish:{name:"Duck Confit Gumbo",description:"Rich, dark roux gumbo featuring 24-hour duck confit.",imageUrl:"https://images.unsplash.com/photo-1548943487-a2e4f43b4850?w=800&q=80"}, lockedSignatureDish:{name:"Bourbon Peach Soufflé",description:"A delicate soufflé that captures the essence of a Southern summer.",imageUrl:"https://images.unsplash.com/photo-1511018556340-d16986a1c194?w=800&q=80",bookingsRequired:3} },
  { name:"Chef Amara Diallo", bio:"Exploring the vibrant spices of West Africa through a contemporary lens.", cuisine:["West African","Contemporary"], moods:["Adventure","Comfort"], price:140, rating:4.9, reviews:65, availableNow:false, imageUrl:"https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?w=800&q=80", acceptsSOS:false, offersTheater:true, offersLiveCam:false, signatureDish:{name:"Jollof Arancini",description:"Crispy spheres of smoky jollof rice stuffed with slow-braised goat.",imageUrl:"https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80"}, lockedSignatureDish:{name:"Suya Spiced Lobster",description:"Butter-poached lobster tail dusted with house-ground suya spice.",imageUrl:"https://images.unsplash.com/photo-1533682805518-48d1f5a8bb38?w=800&q=80",bookingsRequired:3} },
  { name:"Chef Sofia Mendes", bio:"Lisbon-born and Barcelona-trained, building tapas-style tasting journeys.", cuisine:["Spanish","Portuguese"], moods:["Celebration","Romantic"], price:135, rating:4.8, reviews:142, availableNow:true, imageUrl:"https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=800&q=80", acceptsSOS:true, offersTheater:false, offersLiveCam:true, signatureDish:{name:"Octopus à la Brasa",description:"Charred Galician octopus over smoked potato cream.",imageUrl:"https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80"}, lockedSignatureDish:{name:"Sherry Cask Crème Catalana",description:"Aged Pedro Ximénez sherry crème under a torched amber crust.",imageUrl:"https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80",bookingsRequired:3} },
  { name:"Chef Raj Patel", bio:"Third-generation chef reinventing his grandmother's Gujarati recipes with modernist techniques.", cuisine:["Indian","Modernist"], moods:["Adventure","Comfort"], price:130, rating:4.9, reviews:98, availableNow:true, imageUrl:"https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=800&q=80", acceptsSOS:true, offersTheater:true, offersLiveCam:false, signatureDish:{name:"Smoked Butter Chicken Cloud",description:"Tandoori chicken under a hickory-smoke cloche.",imageUrl:"https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80"}, lockedSignatureDish:{name:"Saffron Kulfi Sphere",description:"Liquid-nitrogen saffron kulfi sphere with cardamom dust.",imageUrl:"https://images.unsplash.com/photo-1606471191009-63994c53433b?w=800&q=80",bookingsRequired:3} },
];

export async function GET() {
  try {
    await connectDB();
    const existing = await Chef.countDocuments({ userId: { $exists: false } });
    if (existing > 0) return NextResponse.json({ message: `Already seeded: ${existing} demo chefs` });
    // Create demo user accounts for each chef
    const pw = await bcrypt.hash("demo1234", 10);
    for (const c of SEED_CHEFS) {
      const email = `${c.name.toLowerCase().replace(/\s+/g,".")}@aurachefs.demo`;
      let user = await User.findOne({ email });
      if (!user) user = await User.create({ name: c.name, email, password: pw, role: "chef" });
      const exists = await Chef.findOne({ userId: user._id.toString() });
      if (!exists) await Chef.create({ ...c, userId: user._id.toString() });
    }
    return NextResponse.json({ message: `Seeded ${SEED_CHEFS.length} chefs` });
  } catch(e) { console.error(e); return NextResponse.json({ error: "Seed failed" }, { status: 500 }); }
}
