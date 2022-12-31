import React from 'react';
import styles from './page.module.css';

// Mock categories
const categories = [
	{ id: 1, name: 'Podcasts', backgroundColor: 'rgb(20,138, 8)' },
	{ id: 2, name: 'Music', backgroundColor: 'rgb(141,103, 171)' },
	{ id: 3, name: 'News', backgroundColor: 'rgb(240,55, 165)' },
	{ id: 4, name: 'Sports', backgroundColor: 'rgb(39, 133, 106)' },
	{ id: 5, name: 'Comedy', backgroundColor: 'rgb(232,17, 91)' },
	{ id: 6, name: 'Arts', backgroundColor: 'rgb(30,50, 100)' },
	{ id: 7, name: 'Business', backgroundColor: 'rgb(65,0, 245)' },
	{ id: 8, name: 'Education', backgroundColor: 'rgb(230,30, 50)' },
	{ id: 9, name: 'Games & Hobbies', backgroundColor: 'rgb(165, 103, 82)' },
	{
		id: 10,
		name: 'Government & Organizations',
		backgroundColor: 'rgb(186, 93, 7)',
	},
	{ id: 11, name: 'Health', backgroundColor: 'rgb(20,138, 8)' },
	{ id: 12, name: 'Kids & Family', backgroundColor: 'rgb(141,103, 171)' },
	{
		id: 13,
		name: 'Religion & Spirituality',
		backgroundColor: 'rgb(240,55, 165)',
	},
	{ id: 14, name: 'Science & Medicine', backgroundColor: 'rgb(39, 133, 106)' },
	{ id: 15, name: 'Society & Culture', backgroundColor: 'rgb(232,17, 91)' },
	{ id: 16, name: 'TV & Film', backgroundColor: 'rgb(30,50, 100)' },
];

export const Categories = () => {
	return (
		<div className={styles.categoriesContainer}>
			{categories.map(({ id, name, backgroundColor }) => (
				<div key={id} className={styles.category} style={{ backgroundColor }}>
					<div className={styles.categoryText}>{name}</div>
				</div>
			))}
		</div>
	);
};
