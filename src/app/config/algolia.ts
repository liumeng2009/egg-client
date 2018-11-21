export const AlgoliaConfig = {
  searchableAttributes: [
    'title', 'content', 'zhaiyao'
  ],
  hitsPerPage: 5,
  // Define business metrics for ranking and sorting
  customRanking: [
    'desc(publishAt)'
  ],
  attributesToHighlight: [
    '*',
  ],
  attributesForFaceting: ['title']
}

export const AlgoliaQueryConfig = [
  {
    objectID: 'title',
    condition: {
      pattern: '{facet:title}',
      anchoring: 'contains'
    },
    consequence: {
      params: {
        aroundLatLngViaIP: false
      }
    }
  },
  {
    objectID: 'content',
    condition: {
      pattern: '{facet:content}',
      anchoring: 'contains'
    },
    consequence: {
      params: {
        aroundLatLngViaIP: false
      }
    },
  },
]
