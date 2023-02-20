import { SerachCSS } from "../../styleCSS/SerachCSS";
const SearchComponents = () => {
  return (
    <>
      <SerachCSS>
        <form>
          <input type="text" placeholder="입력" />
          <button type="submit">검색</button>
        </form>
      </SerachCSS>
    </>
  );
};

export default SearchComponents;
