import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { Card } from "../../components/Card/Card";
import { ErrorMessage } from "../../components/ErrorMesage/ErrorMessage";
import { Pagination } from "../../components/Pagination/Pagination";
import { Preloader } from "../../components/Preloader/Preloader";
import { getProducts } from "../../services/ajax";
import { SearchField } from "../../components/SearchField/SearchField";
import { getFilteredProducts } from "../../services/ajax";
import { getVisiblePages } from "../../services/functions";

import "./Products.scss";

export function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const productsPerPage = 10;
  const [queryValue, setQueryValue] = useState(
    searchParams.get("search") || ""
  );
  const [totalProducts, setTotalProducts] = useState([]);
  const [hasReload, setHasReload] = useState(true);

  async function loadAllProducts() {
    try {
      const data = await getProducts(170);
      setTotalProducts(data);
      setProducts(getVisiblePages(data, productsPerPage, currentPage));
      hasReload ? setHasReload(false) : setCurrentPage(1);
    } catch {
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  async function loadFilteredProducts() {
    try {
      const data = await getFilteredProducts(queryValue);
      setTotalProducts(data);
      setProducts(getVisiblePages(data, productsPerPage, currentPage));
      hasReload ? setHasReload(false) : setCurrentPage(1);
    } catch {
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!queryValue) {
      searchParams.delete("search");
      loadAllProducts();
      return;
    }
    loadFilteredProducts();
  }, [queryValue]);

  useEffect(() => {
    searchParams.set("page", currentPage);
    setSearchParams(searchParams);
    setProducts(getVisiblePages(totalProducts, productsPerPage, currentPage));
  }, [currentPage]);

  return (
    <div className="Products">
      <div className="Products__container container">
        <div className="Products__top-row">
          <h2 className="Products__title">Dogs</h2>
          <SearchField changeProducts={setQueryValue} />
        </div>
        {queryValue && !products.length && !loading && (
          <ErrorMessage message="There are no dogs with this breed" />
        )}
        {isError && <ErrorMessage />}
        {loading && <Preloader />}
        <div className="Products__catalog">
          {!!products.length &&
            products.map((item) => (
              <div className="Products__card-wrapper" key={item.id}>
                <Card {...item}></Card>
              </div>
            ))}
        </div>
        {!!products.length && (
          <Pagination
            onPageChange={setCurrentPage}
            currentPage={currentPage}
            productsPerPage={productsPerPage}
            totalProductsCount={totalProducts.length}
          />
        )}
      </div>
    </div>
  );
}
