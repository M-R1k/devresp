import localhost from "../config";
import { IonIcon } from "@ionic/react";
import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { searchOutline, closeOutline } from "ionicons/icons";
import { LanguageContext } from "../LanguageContext";
import Autocomplete from "./Autocomplete";

export default function Search() {
  const [product, setProduct] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("All Categories");
  const [searchResults, setSearchResults] = useState([]);
  const [visibleResults, setVisibleResults] = useState(6);
  const [error, setError] = useState("");
  const { t } = useTranslation();
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const { language } = useContext(LanguageContext);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [autocompleteData, setAutocompleteData] = useState([]);
  const [userInput, setUserInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${localhost}/api/search/${language}`);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch product: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        if (data.product && data.product.length > 0) {
          setProduct(data.product);
          setCategories(data.category);
          const combinedSuggestions = [...data.product];
          setSuggestions(combinedSuggestions);
        } else {
          setError(new Error("Product not found"));
        }
      } catch (err) {
        setError(err);
      }
    };

    fetchProduct();
  }, [language]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    sortResults();

    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  const handleShowMore = () => {
    setVisibleResults((prev) => prev + 6); // Affiche 6 résultats supplémentaires
  };

  const handleReset = () => {
    setUserInput(""); // Réinitialise le champ de recherche
    setSearchResults([]); // Vide les résultats de recherche
  };

  const onChange = (e) => {
    const userInput = e.currentTarget.value.toLowerCase();

    const filteredSuggestions = suggestions.filter(
      (suggestion) =>
        (suggestion.name &&
          suggestion.name.toLocaleLowerCase().indexOf(userInput) > -1) ||
        (suggestion.nameEn &&
          suggestion.nameEn.toLocaleLowerCase().indexOf(userInput) > -1)
    );

    setActiveSuggestion(0);
    setFilteredSuggestions(filteredSuggestions);
    setUserInput(userInput);
    setAutocompleteData(
      filteredSuggestions.map((suggestion) =>
        typeof suggestion === "object"
          ? suggestion
          : { name: suggestion.name, image: "", prix: "" }
      )
    );
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      setActiveSuggestion(0);
      setFilteredSuggestions([]);
      setUserInput(filteredSuggestions[activeSuggestion]);
      setAutocompleteData(
        filteredSuggestions.map((suggestion) =>
          typeof suggestion === "object"
            ? suggestion
            : { name: suggestion.name, image: "", prix: "" }
        )
      );
    } else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }
      setActiveSuggestion(activeSuggestion - 1);
    } else if (e.keyCode === 40) {
      if (activeSuggestion + 1 === filteredSuggestions.length) {
        return;
      }
      setActiveSuggestion(activeSuggestion + 1);
    }
  };

  const onClick = (e) => {
    setActiveSuggestion(0);
    setUserInput(e.currentTarget.innerText);
  };

  const sortResults = () => {
    let list = [];

    if (
      categoryName !== "Toutes les catégories" &&
      categoryName !== "All Categories"
    ) {
      list = product.filter(
        (elem) =>
          (elem.category.name === categoryName &&
            elem.name
              .toLocaleLowerCase()
              .includes(userInput.toLocaleLowerCase())) ||
          (elem.category.nameEn === categoryName &&
            elem.nameEn
              .toLocaleLowerCase()
              .includes(userInput.toLocaleLowerCase()))
      );
    } else {
      if (userInput === "") {
        list = [...product];
      } else {
        list = product.filter(
          (elem) =>
            elem.name
              .toLocaleLowerCase()
              .includes(userInput.toLocaleLowerCase()) ||
            elem.nameEn
              .toLocaleLowerCase()
              .includes(userInput.toLocaleLowerCase())
        );
      }
    }
    setSearchResults(list);
  };

  if (error)
    return (
      <div className="text-center py-4 text-red-500">
        Error: {error.message}
      </div>
    );
    
  return (
    <div className="p-4 rounded-lg shadow-md">
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row items-center justify-center gap-2 mb-5"
      >
        <div className="flex w-full md:w-auto rounded-md">
          <input
            type="text"
            className="w-full md:w-72 p-2 m-2 border-2 border-gold text-gold rounded-lg font-primary font-bold bg-white dark:bg-dark-mode-purple"
            placeholder={t("search.searchBar")}
            onChange={onChange}
            onKeyDown={onKeyDown}
            value={userInput}
          />
          <Autocomplete
            autocompleteData={autocompleteData}
            activeSuggestion={activeSuggestion}
            onClick={onClick}
          />
           <button
            type="submit"
            className="p-2 m-2 md:px-4 bg-gold text-white font-bold text-xl rounded-md hover:bg-light-purple transition duration-300 font-primary flex items-center justify-center"
          >
            <IonIcon icon={searchOutline} className="text-2xl" />
          </button>
          {userInput && (
            <button
              type="button"
              onClick={handleReset}
              className="p-2 m-2 md:px-4 bg-red-500 text-white font-bold text-xl rounded-md hover:bg-red-600 transition duration-300 font-primary flex items-center justify-center"
            >
              <IonIcon icon={closeOutline} className="text-2xl" />
            </button>
          )}
          {isSearching && (
            <div className="text-center flex font-primary py-4">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-dark-purple dark:text-gold"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="#CD92F2"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              {t("search.loading")}
            </div>
          )}
          
          {error && (
            <div className="text-center text-red-500 py-4">{error}</div>
          )}
          {!product && !isSearching && (
            <div className="text-center py-4 font-primary text-black">
              {t("search.error")}
            </div>
          )}
        </div>
        <select
          value={categoryName}
          className="w-full md:w-auto p-2 m-2 font-primary text-lg font-bold border-2 border-gold rounded-md dark:bg-dark-mode-purple text-gold"
          onChange={(e) => setCategoryName(e.target.value)}
        >
          <option
            value={
              language === "FR" ? "Toutes les catégories" : "All categories"
            }
            className="text-gold font-primary font-bold text-lg bg-light-purple bg-opacity-20 hover:bg-light-purple dark:hover:bg-dark-mode-light-purple"
          >
            {t("search.select")}
          </option>

          {categories.length > 0 &&
            categories.map((elem) => (
              <option
                key={elem.id}
                value={language === "FR" ? elem.name : elem.nameEn}
                className="text-gold font-primary font-bold text-lg bg-white-purple dark:bg-dark-mode-purple hover: rounded-md border-2 border-gold"
              >
                {language === "FR" ? elem.name : elem.nameEn}
              </option>
            ))}
        </select>
      </form>

      {/* Results  */}
     <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 200px)" }} // Limite la hauteur pour ne pas dépasser le header
      >
        {searchResults.slice(0, visibleResults).map((result) => (
          <Link to={`/product/${result.id}`} key={result.id}>
            <div className="flex flex-col justify-between h-full bg-white-purple dark:bg-dark-mode-purple border border-gold rounded-lg p-4 shadow-lg hover:shadow-xl transition duration-300">
              {/* Image */}
              <img
                src={result.images}
                alt={result.name}
                className="w-full h-32 object-cover rounded-t-lg"
              />

              {/* Nom du produit */}
              <h3 className="font-primary text-gold font-extrabold text-center p-2 text-lg mt-2">
                {language === "FR" ? result.name : result.nameEn}
              </h3>

              {/* Prix */}
              <p className="font-bold p-2 font-secondary text-lg text-light-purple text-right dark:text-white">
                ${result.price}
              </p>

              {/* Bouton Ajouter au panier */}
              <button className="mt-2 p-2 w-full font-primary font-bold rounded-3xl bg-gold text-lg text-white border border-gold py-2 hover:bg-light-purple transition duration-300">
                {t("search.cart")}
              </button>
            </div>
          </Link>
        ))}
      </div>

      {/* Bouton Voir plus */}
      {visibleResults < searchResults.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleShowMore}
            className="px-6 py-2 bg-gold text-white font-bold rounded-lg hover:bg-light-purple transition duration-300"
          >
            {t("search.showMore")}
          </button>
        </div>
      )}
    </div>
  );
}