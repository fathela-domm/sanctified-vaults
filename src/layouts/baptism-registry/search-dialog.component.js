import React, { useState, useEffect, useRef } from "react";
import { BehaviorSubject, from, of } from "rxjs";
import { switchMap, debounceTime, distinctUntilChanged, map, catchError } from "rxjs/operators";
import FirebaseRealtimeDatabaseService from "../../services/firebase-realtime.service";
import Backdrop from "@mui/material/Backdrop";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MDTypography from "components/MDTypography";
import TextField from "@mui/material/TextField";
import MDBox from "components/MDBox";
import Skeleton from "@mui/material/Skeleton";

const style = {
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75%",
  paddingLeft: "27px",
  maxHeight: "80vh",
  overflow: "auto",
};

const searchSubject = new BehaviorSubject("");

export default function SearchDialogComponent(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const dbService = new FirebaseRealtimeDatabaseService();
  const [error, setError] = useState(null);
  const allDataRef = useRef([]); // Store `allData` outside of React state

  // 🔥 Fetching Data from Firebase (without modifying the callback)
  useEffect(() => {
    setIsLoading(true);
    const allRecords = new Set(); // Prevents duplicates

    const fetchData$ = from([...Array(props.numberOfVolumes).keys()]).pipe(
      switchMap((i) =>
        from(
          new Promise((resolve, reject) => {
            dbService.get(`/baptism_registry/${i}/`, (snapshot) => {
              if (snapshot.exists()) {
                const volumeData = Object.entries(snapshot.val()).flatMap(([id, record]) =>
                  Object.values(record).map(entry => {
                    const uniqueKey = `${entry.serialNumber}-${entry.name}-${i + 1}`;
                    allRecords.add(JSON.stringify({ ...entry, volume: i + 1, uniqueKey }));
                    return { ...entry, volume: i + 1, uniqueKey };
                  })
                );
                resolve(volumeData);
              } else {
                resolve([]);
              }
            });
          })
        )
      ),
      catchError((err) => {
        setError(err);
        return of([]);
      })
    );

    const subscription = fetchData$.subscribe(() => {
      allDataRef.current = Array.from(allRecords).map(entry => JSON.parse(entry)); // Store outside state
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [props.numberOfVolumes]);

  // 🔍 RxJS Search with Debounce (Uses `allDataRef` for better performance)
  useEffect(() => {
    const searchSubscription = searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map((query) => {
          if (!query.trim()) return [];
          const regExp = new RegExp(`${query.trim()}`, "gi");
          return allDataRef.current.filter(
            (entryData) =>
              entryData.name.match(regExp) || entryData.serialNumber.toString().match(regExp)
          );
        })
      )
      .subscribe((results) => {
        setFilteredData(results);
      });

    return () => searchSubscription.unsubscribe();
  }, []);

  const handleInputChange = (event) => {
    searchSubject.next(event.target.value); // No `setIsLoading(true)` here to prevent lag
  };

  const handleClickEdit = (id, currentIterationData) => {
    props.setEditEntryID(id);
    props.setOpenEditDialog(true);
    props.setCurrentIterationData(currentIterationData);
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={props.openSearchDialog}
      onClose={() => {
        props.setOpenSearchDialog(false);
        setFilteredData([]);
      }}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={props.openSearchDialog}>
        <Card sx={style}>
          <div style={{ marginRight: "30px", marginTop: "20px", marginBottom: "10px" }}>
            <TextField
              fullWidth
              label="Search Field"
              type="search"
              autoFocus
              autoComplete="off"
              onChange={handleInputChange}
            />
            {isLoading ? (
              <MDBox my={4} py={4} px={4} mb={2} bgColor="dark" color="dark" borderRadius="lg" shadow="sm">
                <Skeleton sx={{ bgcolor: "ivory" }} />
                <Skeleton sx={{ bgcolor: "ivory" }} animation="wave" />
                <Skeleton sx={{ bgcolor: "ivory" }} />
                <Skeleton sx={{ bgcolor: "ivory" }} animation={false} />
                <Skeleton sx={{ bgcolor: "ivory" }} />
              </MDBox>
            ) : filteredData.length > 0 && (
              filteredData.map((data) => (
                <Card className="mt-3" key={data.uniqueKey}>
                  <CardContent
                    style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}
                  >
                    <MDTypography className="pt-4">{data.serialNumber}</MDTypography>
                    <MDTypography className="pt-4">{data.name}</MDTypography>
                    <IconButton
                      className="pt-4"
                      onClick={() => handleClickEdit(data.serialNumber, data)}
                      variant="button"
                      color="text"
                    >
                      <Icon color="warning" style={{ cursor: "pointer" }}>
                        edit
                      </Icon>
                    </IconButton>
                    <MDTypography className="pt-4">{data.baptismalPlace}</MDTypography>
                    <MDTypography className="pt-4">Vol: {data.volume}</MDTypography>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </Card>
      </Fade>
    </Modal>
  );
}
