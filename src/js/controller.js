import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

if (module.hot) module.hot.accept();
///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    recipeView.renderSpinner();
    // 0) Update results view mark as selected
    resultsView.update(model.getSearchResultsPage());

    // 1) Update bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2) loading recipe
    await model.loadRecipe(id);
    // 3) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};
const controlSearchResults = async function () {
  try {
    //0) Get search query
    const query = searchView.getQuery();

    resultsView.renderSpinner();

    //1) load search results
    await model.loadSearchResults(query);

    //2) Rendering results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render pagination
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
  }
};
const controlPagination = function (goToPage) {
  // Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // 4) Render new pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // 2) Rendering updated recipe
  recipeView.update(model.state.recipe);
  // Update the recipeView
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);
  // 3) Render bookmarks view
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    // Uplaod new recipe
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Render succes message
    addRecipeView.renderMessage();

    // Render bookmartk view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.closeWindow();
      window.location.reload();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateService(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerRender(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
  console.log('Test');
};
init();
