import React, { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";

import { Card } from "../../components/Card/Card";
import { ErrorMessage } from "../../components/ErrorMesage/ErrorMessage";
import { Pagination } from "../../components/Pagination/Pagination";
import { Preloader } from "../../components/Preloader/Preloader";
import { SearchField } from "../../components/SearchField/SearchField";
import { getProducts } from "../../services/ajax";
import { filterCompareData } from "../../services/ajax";
import { getVisiblePages } from "../../services/functions";
import { ProductsContext } from "../../App";

import "./Products.scss";

export function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [isInstant] = useState(true);
  const ProductsPerPage = 10;
  const [filteredCurrentPage, setFilteredCurrentPage] = useState(1);
  const [totalFilteredProducts, setTotalFilteredProducts] = useState(0);
  const { productsFromContext } = useContext(ProductsContext);

  async function loadProducts() {
    try {
      setLoading(true);
      setProducts([]);
      const data = await getProducts(ProductsPerPage, currentPage - 1);
      setProducts(data);
    } catch {
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  async function loadFilteredPosts() {
    try {
      const filteredData = await filterCompareData(productsFromContext);
      setTotalFilteredProducts(filteredData.length);
      setProducts(
        getVisiblePages(filteredData, ProductsPerPage, filteredCurrentPage)
      );
    } catch {
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    searchParams.delete("search");
    searchParams.set("page", currentPage);
    setSearchParams(searchParams);
    loadProducts();
  }, [currentPage]);

  useEffect(() => {
    if (!productsFromContext) return;
    if (productsFromContext.length) {
      loadFilteredPosts();
      searchParams.delete("page");
      searchParams.set("search", filteredCurrentPage);
      setSearchParams(searchParams);
      return;
    }
    if (products.length) {
      searchParams.delete("search");
      searchParams.set("page", currentPage);
      setSearchParams(searchParams);
      loadProducts();
    }
  }, [productsFromContext, filteredCurrentPage]);

  return (
    <div className="Products">
      <div className="Products__container container">
        <div className="Products__top-row">
          <h2 className="Products__title">Dogs</h2>
          <SearchField instant={isInstant} />
        </div>
        {!productsFromContext && (
          <ErrorMessage message="There are no dogs with this name" />
        )}
        {isError && <ErrorMessage />}
        {loading && <Preloader />}
        <div className="Products__catalog">
          {productsFromContext &&
            products &&
            products.map((item) => (
              <div className="Products__card-wrapper" key={item.id}>
                <Card {...item}></Card>
              </div>
            ))}
        </div>
        {productsFromContext && !productsFromContext.length ? (
          <Pagination onPageChange={setCurrentPage} currentPage={currentPage} />
        ) : (
          productsFromContext && (
            <Pagination
              onPageChange={setFilteredCurrentPage}
              currentPage={filteredCurrentPage}
              totalProducts={totalFilteredProducts}
              productsPerPage={ProductsPerPage}
            />
          )
        )}
      </div>
    </div>
  );
}
