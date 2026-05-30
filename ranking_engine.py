import pandas as pd

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Load dataset
df = pd.read_csv("merged_all_resumes.csv")

# Load embedding model
model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)


def rank_candidates(
    category,
    required_skills,
    offered_salary=10
):
    """
    Ranking kandidat menggunakan:
    - Sentence Transformer
    - Cosine Similarity

    offered_salary sementara belum dipakai,
    hanya disiapkan untuk tahap salary matching.
    """

    filtered_df = df[
        df["category"] == category
    ].copy()

    # Gabungkan skill lowongan menjadi teks
    job_text = " ".join(
        required_skills
    )

    # Embedding lowongan
    job_embedding = model.encode(
        job_text
    )

    scores = []

    for _, row in filtered_df.iterrows():

        candidate_text = str(
            row["extracted_skills"]
        )

        candidate_embedding = model.encode(
            candidate_text
        )

        similarity = cosine_similarity(
            [job_embedding],
            [candidate_embedding]
        )[0][0]

        scores.append(
            round(
                float(similarity * 100),
                2
            )
        )

    filtered_df["score"] = scores

    ranked = filtered_df.sort_values(
        by="score",
        ascending=False
    )

    result = ranked[
        [
            "resume_id",
            "score",
            "extracted_skills"
        ]
    ].head(10)

    result.insert(
        0,
        "rank",
        range(
            1,
            len(result) + 1
        )
    )

    return result


if __name__ == "__main__":

    result = rank_candidates(
        "ACCOUNTANT",
        [
            "excel",
            "accounting",
            "budgeting"
        ],
        10
    )

    print(result)