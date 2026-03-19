import { css } from '../../../dist/styled-system/css';
import { Button } from '@components/Button/Button';
import { KB } from '@components/KB/KB';
import { Character, CHARACTER_STATE } from '@components/Character/Character';
import { STATUS } from '@lib/utilities/gameLogic';
import { GAME_MODES } from '@lib/constants/stages';
import { useEnterKey } from '@lib/hooks/useEnterKey';
import { flexCenter } from '@lib/constants/ui';
import { reportMistakeUrl } from '@lib/constants/forms';

const SPACING = {
	SECTION_GAP: '3xl',
	BUTTON_GAP: 'lg',
	CHARACTER_GAP: '3xl',
};

const KB_DISABLED_OPACITY = 0.01;

export const Unanswered = ({ solution, showBaseline }) => (
	<div className={css(flexCenter)}>
		<Character
			state={CHARACTER_STATE.AWAIT_ANSWER}
			imagePath={solution.imagePath}
			showBaseline={showBaseline}
			note={solution.graph.note}
		/>
	</div>
);

export const CorrectAnswer = ({
	solution,
	onNext,
	acceptedAs24Letter,
	showBaseline,
	alphabetMetadata = {},
}) => {
	const {
		sourceUri: alphabetLink,
		title: alphabetTitle,
		date: alphabetDate,
	} = alphabetMetadata;

	useEnterKey(onNext);

	return (
		<>
			<div className={css(flexCenter)}>
				<Character
					state={CHARACTER_STATE.CORRECT_ANSWER}
					imagePath={solution.imagePath}
					character={solution.graph.character}
					alphabetLink={alphabetLink}
					alphabetTitle={alphabetTitle}
					alphabetDate={alphabetDate}
					showBaseline={showBaseline}
					note={solution.graph.note}
				/>
			</div>
			{acceptedAs24Letter && (
				<div
					className={css({
						textAlign: 'center',
						marginTop: 'lg',
						padding: 'md',
						color: '{colors.error}',
						border: '1px solid {colors.error}',
						fontSize: 's',
						fontWeight: '600',
						width: '300px',
						margin: 'auto',
					})}
				>
					Accepted: Using 24-letter alphabet, so I and J and U and V
					are interchangeable
				</div>
			)}
			<div
				className={css({
					display: 'flex',
					gap: SPACING.BUTTON_GAP,
					justifyContent: 'center',
					marginTop: SPACING.SECTION_GAP,
				})}
			>
				<Button onClick={onNext} label="Next" />
			</div>
		</>
	);
};

export const IncorrectAnswer = ({
	solution,
	attempt,
	attemptImagePaths,
	onNext,
	showBaseline,
	alphabetMetadata = {},
}) => {
	const {
		sourceUri: alphabetLink,
		title: alphabetTitle,
		date: alphabetDate,
	} = alphabetMetadata;

	useEnterKey(onNext);

	return (
		<>
			<div
				className={css({
					display: 'flex',
					gap: SPACING.CHARACTER_GAP,
					justifyContent: 'center',
					alignItems: 'flex-start',
				})}
			>
				<Character
					state={CHARACTER_STATE.INCORRECT_ANSWER}
					imagePaths={attemptImagePaths}
					character={attempt}
					showBaseline={showBaseline}
				/>
				<Character
					state={CHARACTER_STATE.CORRECT_ANSWER}
					imagePath={solution.imagePath}
					character={solution.graph.character}
					alphabetLink={alphabetLink}
					alphabetTitle={alphabetTitle}
					alphabetDate={alphabetDate}
					showBaseline={showBaseline}
					note={solution.graph.note}
				/>
			</div>

			<div
				className={css({
					display: 'flex',
					gap: SPACING.BUTTON_GAP,
					justifyContent: 'center',
					marginTop: SPACING.SECTION_GAP,
				})}
			>
				<Button onClick={onNext} label="Next" />
			</div>
			<div
				className={css({
					display: 'flex',
					justifyContent: 'center',
					marginTop: 'lg',
				})}
			>
				<a
					href={reportMistakeUrl({
						imagePath: solution.imagePath,
						collection: alphabetTitle,
					})}
					onClick={(e) => {
						e.preventDefault();
						window.open(
							reportMistakeUrl({
								imagePath: solution.imagePath,
								collection: alphabetTitle,
							}),
							'_blank',
							'noopener,noreferrer,width=700,height=600'
						);
					}}
					rel="noreferrer"
					className={css({
						fontSize: 'xs',
						color: 'fg.subtle',
						textDecoration: 'underline',
						cursor: 'pointer',
						_hover: { color: 'fg' },
					})}
				>
					Report a mistake
				</a>
			</div>
		</>
	);
};

export const StatusDisplay = ({
	status,
	solution,
	attempt,
	attemptImagePaths,
	acceptedAs24Letter,
	onNext,
	showBaseline,
	alphabetMetadata,
}) => {
	switch (status) {
		case STATUS.CORRECT:
			return (
				<CorrectAnswer
					solution={solution}
					onNext={onNext}
					acceptedAs24Letter={acceptedAs24Letter}
					showBaseline={showBaseline}
					alphabetMetadata={alphabetMetadata}
				/>
			);
		case STATUS.INCORRECT:
			return (
				<IncorrectAnswer
					attempt={attempt}
					attemptImagePaths={attemptImagePaths}
					solution={solution}
					onNext={onNext}
					showBaseline={showBaseline}
					alphabetMetadata={alphabetMetadata}
				/>
			);
		case STATUS.NONE:
		default:
			return (
				<Unanswered solution={solution} showBaseline={showBaseline} />
			);
	}
};

export const GamePresentation = ({
	currentSolution,
	attempt,
	attemptImagePaths,
	attemptStatus,
	acceptedAs24Letter,
	twentyFourLetterAlphabet,
	showBaseline,
	initialKeyboardLayout,
	gameMode,
	alphabetMetadata,
	onKeyPress,
	onNextLetter,
	onEndGame,
}) => {
	// Show shift keys only when playing "both" (ALL) mode
	const showShiftKeys = gameMode === GAME_MODES.ALL;

	return (
		<div
			className={css({
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: SPACING.SECTION_GAP,
				paddingTop: SPACING.SECTION_GAP,
				paddingBottom: SPACING.SECTION_GAP,
				paddingLeft: { base: 0, sm: SPACING.SECTION_GAP },
				paddingRight: { base: 0, sm: SPACING.SECTION_GAP },
			})}
		>
			<StatusDisplay
				status={attemptStatus}
				solution={currentSolution}
				attempt={attempt}
				attemptImagePaths={attemptImagePaths}
				acceptedAs24Letter={acceptedAs24Letter}
				onNext={onNextLetter}
				showBaseline={showBaseline}
				alphabetMetadata={alphabetMetadata}
			/>

			<div
				className={css({
					opacity: attempt ? KB_DISABLED_OPACITY : 1,
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
				})}
			>
				<KB
					keyCallback={attempt ? undefined : onKeyPress}
					initialLayout={initialKeyboardLayout}
					twentyFourLetterAlphabet={twentyFourLetterAlphabet}
					showShiftKeys={showShiftKeys}
				/>
			</div>

			<div
				className={css({
					display: 'flex',
					gap: SPACING.BUTTON_GAP,
					justifyContent: 'center',
				})}
			>
				<Button onClick={onEndGame} label="End Game" />
			</div>
		</div>
	);
};
