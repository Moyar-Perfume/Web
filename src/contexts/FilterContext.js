import { createContext, useContext, useState, useEffect, useRef } from "react";

const DataContext = createContext();

export function useFilter() {
  return useContext(DataContext);
}

export function FilterContext({ children }) {
  // Budget
  const minPrice = 0;
  const maxPrice = 10000000;

  const [budget, setBudget] = useState([0, 100]);
  const [budgetRange, setBudgetRange] = useState([minPrice, maxPrice]);

  useEffect(() => {
    const minVal = Math.round((budget[0] / 100) * maxPrice);
    const maxVal = Math.round((budget[1] / 100) * maxPrice);
    setBudgetRange([minVal, maxVal]);
  }, [budget]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Seasons

  const [selectedSeasons, setSelectedSeasons] = useState([]);
  const toggleSeason = (id) => {
    setSelectedSeasons((prev) => {
      if (prev.includes(id)) {
        return prev.filter((seasonId) => seasonId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Concentrations

  const [selectedConcents, setSelectedConcents] = useState([]);
  const toggleConcent = (id) => {
    setSelectedConcents((prev) => {
      if (prev.includes(id)) {
        return prev.filter((concentId) => concentId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Brands

  const [selectedBrands, setSelectedBrands] = useState([]);
  const toggleBrand = (id) => {
    setSelectedBrands((prev) => {
      if (prev.includes(id)) {
        return prev.filter((brandId) => brandId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Scent

  const [selectedScent, setSelectedScent] = useState(null);
  const subScentsRef = useRef(null);

  useEffect(() => {
    if (selectedScent && subScentsRef.current) {
      const element = subScentsRef.current;
      const windowHeight = window.innerHeight;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const elementHeight = element.offsetHeight;

      const offset = (windowHeight - elementHeight) / 2 + 200;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  }, [selectedScent]);

  // Sub-Scents
  const [selectedSubScents, setSelectedSubScents] = useState([]);

  const toggleSubScent = (id) => {
    setSelectedSubScents((prev) =>
      prev.includes(id)
        ? prev.filter((scentId) => scentId !== id)
        : [...prev, id]
    );
  };

  return (
    <DataContext.Provider
      value={{
        //Budget
        budget,
        setBudget,
        budgetRange,
        formatPrice,

        //Season
        selectedSeasons,
        toggleSeason,

        //Concent
        selectedConcents,
        toggleConcent,

        //Brand
        selectedBrands,
        toggleBrand,

        //Scent
        selectedScent,
        setSelectedScent,

        //Sub-Scent
        selectedSubScents,
        subScentsRef,
        setSelectedSubScents,
        toggleSubScent,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
