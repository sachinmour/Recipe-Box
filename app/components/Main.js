import React from "react";

class Main extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            recipes: [],
            toggle: true
        }
    }

    componentDidMount() {
        if (!localStorage.recipes) {
            localStorage.recipes = JSON.stringify(new Array());
        } else {
            this.setState({
                recipes: JSON.parse(localStorage.recipes)
            });
        }
    }

    toggleDiv(e) {
        if (!this.state.toggle) {
            return null;
        }
        var ele = $(e.target);
        ele.closest('div').next().slideToggle("fast");
        ele.siblings('i.fa-edit').toggle();

    }

    changeDiv(e) {
        var ele = $(e.target.previousSibling);
        ele.attr('contenteditable', true);
        this.setState({
            toggle: false
        });
        ele.addClass('white');
        ele.focus();
        ele.siblings('div.action').show("fast");
        ele.next("i").hide("fast");
        ele.attr('data-original', ele.text());
    }

    changeName(e) {
        var comp = e.target.className.split(" ")[1];
        var main = $(e.target);
        var ele = main.parent().siblings('p');
        var _this = this;
        var originalName = ele.attr("data-original");
        if (comp === "fa-times") {
            ele.text(originalName);
        } else {
            var recipes = _this.state.recipes;
            var index = recipes.findIndex(function(element) {
                return element.name === originalName
            });
            if (index !== -1) {
                recipes[index].name = ele.text();
                _this.updateRecipes(recipes);
            }
        }
        ele.attr('contenteditable', false);
        this.setState({
            toggle: true
        });
        ele.removeClass('white');
        main.parent('div.action').hide("fast");
        main.parent('div.action').siblings('i').show("fast");
    }

    addIngredient(e) {
        var ele = $(e.target).parent("div.actions").siblings('div.newIngredient');
        ele.show("fast");
        ele.children('p').text("");
        ele.children('p').focus();
    }

    updateIngredients(e) {
        var comp = e.target.className.split(" ")[1];
        var ele = $(e.target).closest("div.newIngredient");
        var _this = this;
        if (comp === "fa-times") {
            ele.hide("fast");
        } else {
            var ingredient = ele.find('p').text();
            if (ingredient.length > 0) {
                var recipeName = ele.closest("div.recipe").find("div.name p").text();
                var recipes = _this.state.recipes;
                var index = recipes.findIndex(function(element) {
                    return element.name === recipeName
                });
                if (index !== -1) {
                    recipes[index].ingredients.push(ingredient);
                }
                _this.updateRecipes(recipes);
                ele.find('p').text("");

            } else {
                ele.hide("fast");
            }
        }
    }

    deleteIngredient(e) {
        var target = $(e.target);
        var indexItem = target.closest('div.item').attr("data-index");
        var recipeName = target.closest('div.recipe').find('div.name p').text();
        var recipes = this.state.recipes;
        var index = recipes.findIndex(function(element) {
            return element.name === recipeName
        });
        if (index !== -1) {
            recipes[index].ingredients.splice(indexItem, 1);
        }
        this.updateRecipes(recipes);
    }

    newRecipe(e) {
        var ele = $(e.target).siblings('div#input');
        ele.children('input').val("");
        ele.show("fast");
    }

    updateRecipes(recipes) {
        this.setState({
            recipes: recipes
        });
        localStorage.recipes = JSON.stringify(this.state.recipes);
    }

    addRecipe(e) {
        var _this = this;
        var comp = e.target.className.split(" ")[1];
        var ele = $(e.target).closest('div#input');
        var input = ele.find('input');
        if (comp === "fa-times") {
            ele.hide("fast");
        } else {
            var recipeName = input.val();
            if (recipeName.length > 0) {
                var recipe = { name: recipeName, ingredients: [] }
                var recipes = this.state.recipes;
                if (!recipes.some(function(element) {
                        return element.name === recipe.name
                    })) {
                    recipes.push(recipe);
                }
                _this.updateRecipes(recipes);
                input.val("");

            } else {
                input.hide("fast");
            }
        }
    }

    deleteRecipe(e) {
        var recipeName = $(e.target).closest('div.recipe').find('div.name p').text();
        var recipes = this.state.recipes;
        var index = recipes.findIndex(function(element) {
            return element.name === recipeName
        });
        if (index !== -1) {
            recipes.splice(index, 1);
        }
        this.updateRecipes(recipes);
    }

    render() {
        var _this = this;

        var recipesHTML = this.state.recipes.map(function(recipe) {

            var ingredientsHTML = recipe.ingredients.map(function(ingredient, i) {
                return (
                    <div className="item" data-index={i}>
        				<p>{ingredient}</p>
        				<i className="fa fa-times" aria-hidden="true" onClick={(e) => _this.deleteIngredient(e)}></i>
        			</div>
                )
            })

            return (
                <div className="recipe" key={recipe.name}>
		        		<div className="name">
			        		<p data-original="" onClick={(e) => _this.toggleDiv(e)}>{recipe.name}</p>
			        		<i className="fa fa-edit" aria-hidden="true" style={{display:'none'}} onClick={(e) => _this.changeDiv(e)}></i>
			        		<div className="action" style={{display:'none'}}>
				        		<i className="fa fa-times" aria-hidden="true" onClick={(e) => _this.changeName(e)}></i>
				        		<i className="fa fa-check" aria-hidden="true" onClick={(e) => _this.changeName(e)}></i>
			        		</div>
		        		</div>
		        		<div className="editable" style={{display:'none'}}>
		        		<div className="ingredients">
		        			<p className="tag">Ingredients</p>
		        			<div className="items">
			        			{ingredientsHTML}
		        			</div>
		        		</div>
		        		<div className="main_action">
		        			<div className="newIngredient" style={{display:'none'}}>
		        				<p contentEditable={true}></p>
				        		<div className="action">
					        		<i className="fa fa-times" aria-hidden="true" onClick={(e) => _this.updateIngredients(e)}></i>
					        		<i className="fa fa-check" aria-hidden="true" onClick={(e) => _this.updateIngredients(e)}></i>
				        		</div>
		        			</div>
		        			<div className="actions">
		        				<p className="add" onClick={(e) => _this.addIngredient(e)}><i className="fa fa-plus" aria-hidden="true"></i></p>
		        				<p className="delete" onClick={(e) => _this.deleteRecipe(e)}>Delete</p>
		        			</div>
		        		</div>
		        		</div>
		        	</div>
            )
        })

        return (
            <div id="content">
	            <div id="recipes">	
		        	{recipesHTML}
		        </div>
		        <div id="addRecipe">
		        	<div id="input" style={{display: 'none'}}>
		        		<input type="text" placeholder="Recipe Name"></input>
		        		<div className="action">
			        		<i className="fa fa-times" aria-hidden="true" onClick={(e) => _this.addRecipe(e)}></i>
			        		<i className="fa fa-check" aria-hidden="true" onClick={(e) => _this.addRecipe(e)}></i>
		        		</div>
		        	</div>
		        	<p className="add" onClick={(e) => _this.newRecipe(e)}>New Recipe</p>
		        </div>
	        </div>

        )
    }

}

export default Main;
