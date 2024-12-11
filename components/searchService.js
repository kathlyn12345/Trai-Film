// src/services/searchService.js
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseconfig";

export const searchMovies = async (searchTerm) => {
  try {
    const genres = [
      "action",
      "recommendation",
      "horror",
      "fantasy",
      "thriller",
      "drama",
      "slides",
    ];
    const allResults = [];

    for (const genre of genres) {
      const q = query(
        collection(db, genre),
        where("title", ">=", searchTerm),
        where("title", "<=", searchTerm + "\uf8ff")
      );

      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,

        ...doc.data(),
        genre,
      }));

      allResults.push(...results);
    }

    return allResults;
  } catch (error) {
    console.error("Error searching movies:", error);
  }
};

export default searchMovies;
