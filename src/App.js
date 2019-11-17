import React, { Component } from "react";
import "./App.css";
import ApolloClient, { gql } from "apollo-boost";
import { ApolloProvider, Query, Mutation } from "react-apollo";

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql"
});

const MOVIES_QUERY = gql`
  {
    movies {
      id
      title
      release_date
    }
  }
`;

const RATED_MOVIES_QUERY = gql`
  {
    ratedMovies {
      id
      title
      rating
    }
  }
`;

const RATE_MOVIE_MUTATION = gql`
  mutation rateMovie($id: ID!, $rating: Int!) {
    rateMovie(id: $id, rating: $rating)
  }
`;

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <Mutation
            mutation={RATE_MOVIE_MUTATION}
            refetchQueries={[{ query: RATED_MOVIES_QUERY }]}
          >
            {rateMovie => (
              <div style={{ float: "left", width: "50%" }}>
                <Query query={MOVIES_QUERY}>
                  {({ loading, error, data }) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error :(</p>;
                    return this.renderMovies(data.movies, rateMovie);
                  }}
                </Query>
              </div>
            )}
          </Mutation>
          <div style={{ float: "left", width: "50%" }}>
            <Query query={RATED_MOVIES_QUERY}>
              {({ loading, error, data }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>Error :(</p>;
                return this.renderRatedMovies(data.ratedMovies);
              }}
            </Query>
          </div>
        </div>
      </ApolloProvider>
    );
  }

  renderRatedMovies(movies) {
    return movies.map(movie => (
      <div key={movie.id}>
        {movie.title} - Rated at: {movie.rating}
      </div>
    ));
  }

  renderMovies(movies, rateMovie) {
    return movies.map(movie => (
      <div key={movie.id}>
        {movie.title}{" "}
        <input
          type="range"
          min="0"
          max="10"
          value={movie.rating}
          onChange={e =>
            rateMovie({
              variables: { id: movie.id, rating: parseInt(e.target.value) }
            })
          }
        />
      </div>
    ));
  }
}

export default App;
