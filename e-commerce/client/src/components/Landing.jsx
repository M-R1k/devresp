import React, { useContext, useEffect, useState } from "react";
import Header from "./Header";
import localhost from "../config";
import { Link } from "react-router-dom";
import Carousel from "./utils/Carousel";
import Promotion from "./Promotion";
import { LanguageContext } from "../LanguageContext";
import Footer from "./Footer";
import Search from "./Search";
import Novelties from "./Novelties";

export default function Accueil() {
  const { language } = useContext(LanguageContext);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${localhost}/api/categorie/${language}`);
      if (response.status === 200) {
        const data = await response.json();
        setCategory(data.allCategory);
      }
    };

    fetchData();
  }, [language]);

  return (
    <div className="bg-white-purple dark:bg-dark-mode-light-purple shadow-md">
    <Header />
    
    <h2 className="text-center font-primary text-black dark:text-gold text-2xl md:text-4xl lg:text-5xl font-bold mt-8 mb-6">
    {language === "FR" ? 'Catégories' : 'Categories'}
    </h2>
  
    <div className="flex items-center justify-center bg-white-purple dark:bg-dark-mode-purple shadow-md shadow-gold p-6 m-4 rounded-lg">
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {category &&
          category.map((elem) => (
            <Link to={`/category/${elem.id}`} key={elem.id}>
              <li className="flex flex-col items-center font-primary text-black dark:text-gold text-lg md:text-xl lg:text-2xl font-bold hover:text-light-purple transition duration-300 bg-light-purple-20 dark:bg-dark-mode-light-purple p-4 rounded-lg shadow-lg hover:shadow-xl">
                <span className="mb-4">
                  {language === "FR" ? elem.name : elem.nameEn}
                </span>
                
                <img
                  src={elem.image}
                  alt={language === "FR" ? elem.name : elem.nameEn}
                  className="w-56 h-56 object-cover border-2 border-white-purple hover:scale-150 duration-300 ease-in-out rounded-md shadow-md dark:shadow-gold"
                  loading="lazy"
                />
              </li>
            </Link>
          ))}
      </ul>
    </div>
  
    <Search />
    <Carousel />
    <Promotion />
    <Novelties />
    <Footer />
  </div>
  );
}
