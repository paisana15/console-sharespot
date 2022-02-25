import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

const Pagination = (props) => {
  const { data, pageNo, setPageNo, count, dataLoading, dataPerPage } = props;
  const [paginationTotalPage, setPaginationTotalPage] = useState(1);

  useEffect(() => {
    if (data) {
      setPaginationTotalPage(Math.floor(Math.ceil(count / dataPerPage)));
    }
  }, [data, count, dataPerPage]);

  const prevButtonClick = () => {
    setPageNo((prev) => prev - 1);
  };

  const nextButtonClick = () => {
    setPageNo((prev) => prev + 1);
  };

  return (
    <Flex>
      <IconButton
        className="button-third-color"
        aria-label='paginate prev'
        icon={<ChevronLeftIcon />}
        onClick={prevButtonClick}
        variant='outline'
        disabled={dataLoading || pageNo === 1}
      />
      <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
        padding='0 1em'
      >
        {pageNo} / {paginationTotalPage}
      </Box>

      {/* {[...Array(paginationTotalPage)].map((x, i) => (
        <PaginationButton
          key={i}
          value={i + 1}
          onClick={() => setPageNo(parseInt(i + 1))}
        />
      ))} */}

      <IconButton
        className="button-third-color"
        aria-label='paginate next'
        icon={<ChevronRightIcon />}
        onClick={nextButtonClick}
        variant='outline'
        disabled={dataLoading || pageNo === paginationTotalPage}
      />
    </Flex>
  );
};

export { Pagination };
