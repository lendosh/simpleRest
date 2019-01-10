package lendos.example.simpleRest.controller;

import com.fasterxml.jackson.annotation.JsonView;
import lendos.example.simpleRest.domain.Data;
import lendos.example.simpleRest.domain.Views;
import lendos.example.simpleRest.repo.DataRepo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("data")
public class DataController {
    private final DataRepo dataRepo;

    @Autowired
    public DataController(DataRepo dataRepo) {
        this.dataRepo = dataRepo;
    }

    @GetMapping
    @JsonView(Views.IdText.class)
    public List<Data> list(){
        return dataRepo.findAll();
    }

    @GetMapping("{id}")
    @JsonView(Views.FullDatesName.class)
    public Data getOne(@PathVariable("id") Data data){
        return data;
    }

    @PostMapping
    public Data create(@RequestBody Data data){
        data.setCreationTime(LocalDateTime.now());
        return dataRepo.save(data);
    }

    @PutMapping("{id}")
    public Data update(
            @PathVariable("id") Data dataFromDb,
            @RequestBody Data data
    ){
        BeanUtils.copyProperties(data, dataFromDb, "id");

        return dataRepo.save(dataFromDb);
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") Data data){
        dataRepo.delete(data);
    }
}
