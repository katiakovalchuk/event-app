import PropTypes from "prop-types";

const SearchInput = ({handleChange}) => {
  return (
    <input
      className="event-search form-control"
      type="search"
      placeholder="Search..."
      aria-label="Search"
      onChange={handleChange}
    />
  );
};

export default SearchInput;

SearchInput.propTypes = {
  handleChange: PropTypes.func,
};
