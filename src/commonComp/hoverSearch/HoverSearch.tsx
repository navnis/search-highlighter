import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import './hoverSearch.scss'
import hoverSearchData from './hoverSearchData'



export const getHighlightedText = (
    text: string,
    highlight: string
): JSX.Element => {

    // highlights the searched match text

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
        <>
            {parts.map((part, i) => (
                <span
                    key={`hightlight_${part + i}`}
                    className={part.toLowerCase() === highlight ? "highlight_text" : ""}
                >
                    {part}
                </span>
            ))}
        </>
    );
};

const HoverSearch: FC = (): JSX.Element => {

    const [searchValue, setSearchValue] = useState<string>("")
    const suggestionContainerRef = useRef<HTMLDivElement>(null);
    const [currentHoverIndex, setCurrentHoverIndex] = useState<number>(-1)
    const [currentHoverId, setCurrentHoverId] = useState<string>("")


    const filterData = (inputData: string) => {
        if (inputData.length === 0) return []
        const filteredCompany = hoverSearchData.filter(data => {
            const allValues = JSON.parse(JSON.stringify(Object.values(data)))
            allValues.shift()
            return allValues.join("; ").toLowerCase().includes(inputData)
        })
        return filteredCompany
    }

    const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value.toLowerCase().trim())
    }

    const onKeyPressHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {

        const allfilteredIds = filterData(searchValue).map(data => data._id)
        // const currentHoveredIndex = allfilteredIds.indexOf(currentHoverId)

        if (e.key === "ArrowUp" && currentHoverIndex !== 0) {
            setCurrentHoverIndex(currentHoverIndex - 1)
            setCurrentHoverId(allfilteredIds[currentHoverIndex - 1])
        } else if (e.key === "ArrowDown" && allfilteredIds.length !== currentHoverIndex + 1) {
            setCurrentHoverIndex(currentHoverIndex + 1)
            setCurrentHoverId(allfilteredIds[currentHoverIndex + 1])

        }
    }

    useEffect(() => {
        const childNodes = suggestionContainerRef.current?.childNodes
        const getElement = document.getElementById(currentHoverId)
        if (childNodes?.length) {
            getElement?.scrollIntoView();
        }
    }, [currentHoverId])


    const onMouseEnterHandler = useCallback((index: number, id: string) => {
        if (currentHoverIndex !== index) {
            setCurrentHoverIndex(index)
            setCurrentHoverId(id)
        }
    }, [currentHoverIndex])






    return (
        <div className="hoverSearch">
            <div className="hoverSearch_main" onKeyDown={onKeyPressHandler}>

                <input className="hoverSearch_input" onChange={onSearch} />
                <div className="hoverSearch_suggestion_main">
                    <div className="hoverSearch_suggestion_container" ref={suggestionContainerRef}>
                        {filterData(searchValue).map((singleData, index) => (
                            <div className={`single_suggestion ${currentHoverIndex === index ? "single_suggestion_hover" : ""}`}
                                key={singleData._id}
                                id={singleData._id}
                                onMouseEnter={() => onMouseEnterHandler(index, singleData._id)}
                            >
                                <h4 className="company">{getHighlightedText(singleData.company, searchValue)}</h4>
                                <p className="name">{getHighlightedText(singleData.name, searchValue)}</p>
                                <p className="address">{getHighlightedText(singleData.address, searchValue)}</p>
                            </div>
                        )
                        )}
                    </div>
                </div>

            </div>
        </div>



    );
}

export default HoverSearch;